/*
 * AI 생성 결과 그림 붙이기
 * 사건 카드의 'AI 생성 결과' 상자(.dv-output)를 찾아, story.js의 case.image 그림을 글 설명 위에 넣는다.
 * app.js는 고치지 않는다. 패널이 새로 그려질 때마다(MutationObserver) 자동으로 다시 붙인다.
 * 글 설명(.dv-output-text)은 지우지 않고 그림 아래 설명으로 남긴다(화면 읽기 프로그램 사용자를 위해).
 */
(function () {
  'use strict';
  var S = window.DiversityStory;
  if (!S || !S.explore) return;

  // story.js에서 그림이 있는 사건 자료만 모은다.
  var cases = Object.keys(S.explore).map(function (k) { return S.explore[k].case; })
    .filter(function (c) { return c && c.image && c.output; });

  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }

  function enhance(box) {
    if (box.getAttribute('data-dv-img')) return;
    var text = box.querySelector('.dv-output-text');
    if (!text) return;
    var c = cases.filter(function (x) { return clean(x.output) === clean(text.textContent); })[0];
    if (!c) return;
    box.setAttribute('data-dv-img', '1');

    var fig = document.createElement('figure');
    fig.className = 'dv-output-figure';
    var img = document.createElement('img');
    img.className = 'dv-output-img';
    img.src = c.image;
    img.alt = c.imageAlt || c.output;
    img.decoding = 'async';
    // 그림 파일을 못 찾으면 그림 자리를 숨기고 글 설명만 보여 준다.
    img.onerror = function () { fig.hidden = true; text.classList.remove('dv-output-caption'); };
    var tag = document.createElement('span');
    tag.className = 'dv-output-tag';
    tag.textContent = 'AI 생성 이미지';
    fig.appendChild(img);
    fig.appendChild(tag);
    text.parentNode.insertBefore(fig, text);
    text.classList.add('dv-output-caption');

    // 머리글의 '(이미지를 글로 설명)'은 이제 맞지 않으므로 지운다.
    var walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null);
    var n, hits = [];
    while ((n = walker.nextNode())) { if (n.nodeValue.indexOf('이미지를 글로 설명') >= 0) hits.push(n); }
    hits.forEach(function (node) {
      node.nodeValue = node.nodeValue.replace(/\s*\(?\s*이미지를 글로 설명\s*\)?/, '');
      var p = node.parentNode;
      if (p && p !== box && !clean(p.textContent)) p.hidden = true;
    });
  }

  function scan() {
    var boxes = document.querySelectorAll('.dv-output');
    for (var i = 0; i < boxes.length; i++) enhance(boxes[i]);
  }

  var root = document.getElementById('panel') || document.body;
  new MutationObserver(scan).observe(root, { childList: true, subtree: true });
  scan();
})();
