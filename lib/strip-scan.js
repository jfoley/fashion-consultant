function StripScan(string, re) {
    var s = string;
    var stripped = '';
    var m, r = [];
    while (m = re.exec(s)) {
      var docMatch = m[0];
      var md = m[1];
      r.push(md);

      stripped += (s.slice(0, m.index));

      s = s.slice(m.index + docMatch.length);
    }

    stripped += s;
    r.stripped = stripped;
    return r;
};

module.exports = StripScan;
