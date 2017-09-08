/**
 *   解决ios单页不能更新title
 **/
export function changeTitle(title) {
  var body = document.body;
  document.title = title;
  var iframe = document.createElement("iframe");
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