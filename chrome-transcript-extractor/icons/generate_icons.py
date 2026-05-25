import os
from PIL import Image, ImageDraw

def create_gradient_canvas(size, color1, color2):
    # Create a vertical gradient
    base = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(base)
    
    # Unpack RGB colors
    r1, g1, b1 = color1
    r2, g2, b2 = color2
    
    for y in range(size):
        # Interpolate colors
        ratio = y / max(1, size - 1)
        r = int(r1 + (r2 - r1) * ratio)
        g = int(g1 + (g2 - g1) * ratio)
        b = int(b1 + (b2 - b1) * ratio)
        
        # Draw a horizontal line for each pixel row
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
        
    return base

def generate_icons():
    os.makedirs('icons', exist_ok=True)
    
    # Modern theme colors: Indigo to Cyan (RGB values)
    indigo = (79, 70, 229)
    cyan = (6, 182, 212)
    
    for size in [16, 48, 128]:
        # Create gradient canvas
        gradient_img = create_gradient_canvas(size, indigo, cyan)
        
        # Create mask for rounded corners
        mask = Image.new('L', (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        margin = max(1, size // 16)
        radius = size // 4
        
        mask_draw.rounded_rectangle(
            [margin, margin, size - margin, size - margin],
            radius=radius,
            fill=255
        )
        
        # Apply mask
        final_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        final_img.paste(gradient_img, (0, 0), mask=mask)
        
        # Draw foreground symbol: a document with transcript lines and a check/clipboard feel
        draw = ImageDraw.Draw(final_img)
        
        # Let's adjust dimensions based on size
        # We will draw a small sheet of paper with lines
        # Left, Top, Right, Bottom of paper
        p_left = int(size * 0.28)
        p_top = int(size * 0.22)
        p_right = int(size * 0.72)
        p_bottom = int(size * 0.78)
        
        # Draw document outline / fill
        draw.rounded_rectangle(
            [p_left, p_top, p_right, p_bottom],
            radius=max(1, size // 16),
            fill=(255, 255, 255, 40),
            outline=(255, 255, 255, 220),
            width=max(1, size // 24)
        )
        
        # Draw lines inside document representing transcript text
        line_count = 4
        spacing = (p_bottom - p_top) // (line_count + 1)
        for i in range(1, line_count + 1):
            ly = p_top + i * spacing
            l_left = p_left + max(2, size // 12)
            # Make first 3 lines longer, last one shorter
            l_right = p_right - max(2, size // 12) if i < line_count else p_left + (p_right - p_left) // 2
            
            draw.line(
                [(l_left, ly), (l_right, ly)],
                fill=(255, 255, 255, 200),
                width=max(1, size // 24)
            )
            
        # Draw a clipboard loop or copy overlap box in bottom-right corner for larger sizes
        if size >= 48:
            # Overlap copy box
            c_left = int(size * 0.58)
            c_top = int(size * 0.58)
            c_right = int(size * 0.85)
            c_bottom = int(size * 0.85)
            
            draw.rounded_rectangle(
                [c_left, c_top, c_right, c_bottom],
                radius=max(1, size // 24),
                fill=(79, 70, 229, 240), # solid indigo/purple color
                outline=(255, 255, 255, 255),
                width=max(1, size // 32)
            )
            
            # Draw a tiny white checkmark inside the copy box
            chk_draw = ImageDraw.Draw(final_img)
            # Coordinates for checkmark
            cw = c_right - c_left
            ch = c_bottom - c_top
            pt1 = (c_left + cw * 0.3, c_top + ch * 0.5)
            pt2 = (c_left + cw * 0.45, c_top + ch * 0.65)
            pt3 = (c_left + cw * 0.75, c_top + ch * 0.35)
            chk_draw.line([pt1, pt2, pt3], fill=(255, 255, 255, 255), width=max(1, size // 24))

        final_img.save(f'icons/icon-{size}.png')
        print(f'Created icons/icon-{size}.png ({size}x{size})')

if __name__ == '__main__':
    generate_icons()
