/*
 * 한 화면 맞추기 도우미
 * 휴대폰에서는 카드 영역(#panel)이 따로 스크롤된다(diversity.css 참고).
 * 다음 화면(제목이 바뀐 카드)으로 넘어가면 카드 스크롤을 맨 위로 돌려놓는다.
 * 같은 카드 안에서 선택지를 누를 때는 스크롤 위치를 그대로 둔다.
 */
(function () {
  'use strict';
  var panel = document.getElementById('panel');
  if (!panel) return;
  var last = '';
  function key() {
    var eyebrow = panel.querySelector('.dv-eyebrow');
    var title = panel.querySelector('.dv-title, h1, h2');
    return (eyebrow ? eyebrow.textContent : '') + '|' + (title ? title.textContent : '');
  }
  new MutationObserver(function () {
    var k = key();
    if (k !== last) { last = k; panel.scrollTop = 0; }
  }).observe(panel, { childList: true, subtree: true });
})();
