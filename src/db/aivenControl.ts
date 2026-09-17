import { parsedEnvironment } from '../settings/parsedEnvironment.js';

interface GetServiceResponse {
  errors?: [];
  service?: {
    service_uri_params: {
      dbname: string;
      host: string;
      password: string;
      port: string;
      sslmode: string;
      user: string;
    };
  };
}

interface UpdateServiceResponse {
  service: { state: 'RUNNING' | 'REBUILDING' };
}

interface DatabaseResponse {
  database_name: string;
}

interface GetDatabasesResponse {
  databases: DatabaseResponse[];
}

const getConnectionString = async (): Promise<string> => {
  if (parsedEnvironment.DB_ENV === 'dev')
    throw new Error('Can only use Aiven on production.');

  const aivenData = {
    projectName: parsedEnvironment.AIVEN_PROJECT_NAME,
    serviceName: parsedEnvironment.AIVEN_SERVICE_NAME,
    databaseName: parsedEnvironment.AIVEN_DB_NAME,
    token: parsedEnvironment.AIVEN_TOKEN,
  };

  const getServiceData = async (): Promise<GetServiceResponse> => {
    const serviceDataRaw = await fetch(
      `https://api.aiven.io/v1/project/${aivenData.projectName}/service/${aivenData.serviceName}`,
      {
        headers: { Authorization: `aivenv1 ${aivenData.token}` },
      },
    );

    return (await serviceDataRaw.json()) as GetServiceResponse;
  };

  const createService = async (): Promise<Response> =>
    fetch('https://api.aiven.io/v1/project/pixie-project/service', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${aivenData.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_name: aivenData.serviceName,
        cloud: 'do-blr',
        plan: 'free-1-1gb',
        service_type: 'pg',
      }),
    });

  const getAllDatabases = async (): Promise<DatabaseResponse[]> => {
    const allDatabasesRaw = await fetch(
      `https://api.aiven.io/v1/project/${aivenData.projectName}/service/${aivenData.serviceName}/db`,
      {
        headers: { Authorization: `aivenv1 ${aivenData.token}` },
      },
    );

    const { databases } =
      (await allDatabasesRaw.json()) as GetDatabasesResponse;

    return databases;
  };

  const createDatabase = async (): Promise<void> => {
    await fetch(
      `https://api.aiven.io/v1/project/${aivenData.projectName}/service/${aivenData.serviceName}/db`,
      {
        method: 'POST',
        headers: {
          Authorization: `aivenv1 ${aivenData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          database: aivenData.databaseName,
        }),
      },
    );
  };

  // Check if service exists
  const { errors } = await getServiceData();
  if (errors) await createService();

  // Make sure the service isn't powered off
  const servicePowerDataRaw = await fetch(
    `https://api.aiven.io/v1/project/${aivenData.projectName}/service/${aivenData.serviceName}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `aivenv1 ${aivenData.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ powered: true }),
    },
  );
  const servicePowerData =
    (await servicePowerDataRaw.json()) as UpdateServiceResponse;

  if (servicePowerData.service.state !== 'RUNNING')
    throw new Error('Service is still rebuilding! Try again later.');

  const databasesInService = await getAllDatabases();

  // Make sure the given database exists
  const didDatabaseExist = databasesInService.some(
    (response) => response.database_name === aivenData.databaseName,
  );

  if (!didDatabaseExist) {
    await createDatabase();
  }

  const { service } = await getServiceData();

  if (!service)
    throw new Error(
      'Could not find the service details for the connection string.',
    );

  const { host, password, port, user } = service.service_uri_params;

  return `postgres://${user}:${password}@${host}:${port}/${aivenData.databaseName}`;
};

export { getConnectionString };
