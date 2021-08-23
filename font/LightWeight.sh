filename="NotoSansKR-Regular.otf" &&
text=" 1234567890,./:-%일보스주간월이지자쿰노멀파풀라투매그너힐혼테반피에르블러디퀸벨룸레온아카럼웅오핑크빈하드시우데미안가엔슬루윌더듄켈진선택받은세렌검마법사빡도로단룹름차순내림" &&

filenameNoextension="${filename%.*}" &&

pyftsubset "${filename}" \
  --output-file="${filenameNoextension}.subset.otf" \
  --text="{$text}" \
  --layout-features='*' \
  --glyph-names \
  --symbol-cmap \
  --legacy-cmap \
  --notdef-glyph \
  --notdef-outline \
  --recommended-glyphs \
  --name-legacy \
  --drop-tables= \
  --name-IDs='*' \
  --name-languages='*' &&

pyftsubset "${filename}" \
  --flavor="woff" \
  --with-zopfli \
  --output-file="${filenameNoextension}.subset.woff" \
  --text="{$text}" \
  --layout-features='*' \
  --glyph-names \
  --symbol-cmap \
  --legacy-cmap \
  --notdef-glyph \
  --notdef-outline \
  --recommended-glyphs \
  --name-legacy \
  --drop-tables= \
  --name-IDs='*' \
  --name-languages='*' &&

  pyftsubset "${filename}" \
  --flavor="woff2" \
  --output-file="${filenameNoextension}.subset.woff2" \
  --text="{$text}" \
  --layout-features='*' \
  --glyph-names \
  --symbol-cmap \
  --legacy-cmap \
  --notdef-glyph \
  --notdef-outline \
  --recommended-glyphs \
  --name-legacy \
  --drop-tables= \
  --name-IDs='*' \
  --name-languages='*'