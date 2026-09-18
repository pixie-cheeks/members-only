const hamburgerMenuDom = document.querySelector('#js-hamburger-menu');
if (!hamburgerMenuDom) throw new Error('Could not find hamburger menu');

const navListDom = document.querySelector('#js-nav-list');
if (!navListDom) throw new Error('Could not find navigation list.');

const activeClass = 'active';

hamburgerMenuDom.addEventListener('click', () => {
  hamburgerMenuDom.ariaExpanded = hamburgerMenuDom.classList
    .toggle(activeClass)
    .toString();
  navListDom.classList.toggle(activeClass);
});
