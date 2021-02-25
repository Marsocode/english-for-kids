export default function menuOnload() {
  const menuHamburger = document.getElementById('menu_hamburger');
  const menuList = document.getElementById('menu_list');

  document.addEventListener('click', (e) => {
    const { target } = e;

    function hideMenu() {
      menuHamburger.classList.remove('close');
      menuList.setAttribute('data-hide', '');
      menuList.style.transform = 'translateX(-100%)';
      document.body.classList.remove('lock');
    }

    function openMenu() {
      menuHamburger.classList.add('close');
      menuList.removeAttribute('data-hide');
      menuList.style.transform = 'translateX(0)';
      document.body.classList.add('lock');
    }

    if (!target) {
      return;
    }

    if (target.tagName === 'LI') {
      hideMenu();
      return;
    }

    if (target.closest('.menu_list')) {
      return;
    }

    if (target.closest('#menu_hamburger') && menuList.hasAttribute('data-hide')) {
      openMenu();
      return;
    }

    if (target.tagName === 'span' || !menuList.hasAttribute('data-hide')) {
      hideMenu();
    }
  });
}
