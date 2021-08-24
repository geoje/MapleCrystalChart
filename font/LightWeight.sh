#!/bin/bash
text="1234567890▼▲-+.% 단일그룹오름차순내림타보이기숨데터입력스지자쿰,()노멀파풀라투매너힐혼테반피에르블러디퀸벨룸레온아카럼웅핑크빈하드주간시우미안가엔슬루윌더듄켈진선택받은세렌월검마법사빡도로\n곳콜렉NPC의결정석격를올려요<br>tlV여클립서붙넣또는을할수있습니다제출개발중"

for filename in "NanumSquareB.ttf" "NotoSansKR-Regular.otf"
do
  filenameNoextension="${filename%.*}"
  echo "[${filenameNoextension}]"

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
    --name-languages='*'
  echo "${filenameNoextension}.subset.otf"

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
    --name-languages='*'
  echo "${filenameNoextension}.subset.woff"

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
  echo "${filenameNoextension}.subset.woff2"
  echo ""
done