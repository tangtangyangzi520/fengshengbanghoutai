/**
 *   解决ios单页不能更新title
 **/
import favicon from '../assets/images/avatar.png'
export function changeTitle(title) {
  var body = document.body;
  document.title = title;
  var iframe = document.createElement("iframe");
  iframe.src =  favicon;
  iframe.style.display = 'none';
  iframe.addEventListener('load', function() {
    setTimeout(function() {
      iframe.removeEventListener('load',function () {
      }, false);
      body.removeChild(iframe);
    }, 0);
  },false);
  body.appendChild(iframe);
}