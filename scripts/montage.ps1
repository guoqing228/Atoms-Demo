Add-Type -AssemblyName System.Drawing

# Build a 3x2 contact sheet of generated apps so the variety is reviewable at a glance.
$items = @(
  @{ file = "todo.png";      label = "待办清单 · Focus List" },
  @{ file = "kanban.ts";     label = "" },
  @{ file = "kanban.png";    label = "看板 · Kanban Studio" },
  @{ file = "notes.png";     label = "Markdown 笔记 · Paper Notes" },
  @{ file = "dashboard.png"; label = "数据看板 · Pulse" },
  @{ file = "landing.png";   label = "落地页 · Northstar" },
  @{ file = "music.png";     label = "音乐播放器 · Tide" }
) | Where-Object { $_.file -like "*.png" }

$cellW = 620
$cellH = 445
$labelH = 34
$gap = 14
$cols = 3
$rows = 2
$w = $cols * $cellW + ($cols + 1) * $gap
$h = $rows * ($cellH + $labelH) + ($rows + 1) * $gap

$canvas = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::FromArgb(246, 242, 233))

$font = New-Object System.Drawing.Font("Microsoft YaHei", 12, [System.Drawing.FontStyle]::Regular)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(34, 31, 26))
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 34, 31, 26), 1)

for ($i = 0; $i -lt $items.Count; $i++) {
  $col = $i % $cols
  $row = [Math]::Floor($i / $cols)
  $x = $gap + $col * ($cellW + $gap)
  $y = $gap + $row * ($cellH + $labelH + $gap)

  $src = [System.Drawing.Image]::FromFile((Join-Path "shots\recipes" $items[$i].file))
  $g.DrawImage($src, $x, $y, $cellW, $cellH)
  $src.Dispose()
  $g.DrawRectangle($pen, $x, $y, $cellW, $cellH)

  $g.DrawString($items[$i].label, $font, $brush, ($x + 2), ($y + $cellH + 8))
}

$out = "shots\montage-recipes.png"
$canvas.Save((Join-Path (Get-Location) $out), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $canvas.Dispose()
"wrote $out"
