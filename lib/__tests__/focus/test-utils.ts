export const setupDom = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <button id="btn1">Button 1</button>
    <input id="input1" type="text" placeholder="Input 1" />
    <a id="link1" href="#">Link 1</a>
    <button id="btn2">Button 2</button>
    <select id="select1">
      <option>Option 1</option>
    </select>
  `;
  document.body.appendChild(container);

  const elements = container.querySelectorAll<HTMLElement>('*');
  elements.forEach((el) => {
    Object.defineProperty(el, 'offsetWidth', { value: 100, configurable: true });
    Object.defineProperty(el, 'offsetHeight', { value: 20, configurable: true });
  });

  return {
    container,
    cleanup: () => {
      document.body.removeChild(container);
      document.body.focus();
    },
  };
};
