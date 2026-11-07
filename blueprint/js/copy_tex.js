document.addEventListener("copy", function (event) {
  var sel = window.getSelection(), doc = window.MathJax && MathJax.startup && MathJax.startup.document;
  if (!sel || sel.isCollapsed || !sel.rangeCount || !event.clipboardData || !doc || !doc.math) return;
  for (var item of doc.math) {
    if (!item.typesetRoot) continue;
    item.typesetRoot.setAttribute("data-tex", item.math);
    item.typesetRoot.toggleAttribute("data-tex-display", !!item.display);
  }
  var range = sel.getRangeAt(0), node = range.commonAncestorContainer;
  if (node.nodeType !== 1) node = node.parentNode;
  var inside = node && node.closest("mjx-container[data-tex]"), box = document.createElement("div");
  box.appendChild(inside ? inside.cloneNode(true) : range.cloneContents());
  var found = box.querySelectorAll("mjx-container[data-tex]");
  if (!found.length) return;
  found.forEach(function (c) {
    var d = c.hasAttribute("data-tex-display") ? "$$" : "$";
    c.replaceWith(document.createTextNode(d + c.getAttribute("data-tex").trim() + d));
  });
  event.clipboardData.setData("text/plain", box.textContent);
  event.clipboardData.setData("text/html", box.innerHTML);
  event.preventDefault();
});
