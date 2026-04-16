"""
Invoice PDF generator using reportlab.
Generates a professional Flipkart-branded invoice entirely in memory.
"""

from io import BytesIO
from datetime import datetime
from typing import List, Dict, Any

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER

# ── Brand colours ──────────────────────────────────────────────────────────────
FLIPKART_BLUE   = colors.HexColor("#2874f0")
FLIPKART_DARK   = colors.HexColor("#1a5cc8")
LIGHT_BLUE      = colors.HexColor("#e8f0fe")
DARK_TEXT       = colors.HexColor("#212121")
GREY_TEXT       = colors.HexColor("#757575")
LIGHT_GREY      = colors.HexColor("#f5f5f5")
WHITE           = colors.white

# A4 usable width = 210mm - 15mm*2 margins = 180mm
PAGE_W = 180 * mm


def generate_invoice_pdf(
    order_id: int,
    user_name: str,
    user_email: str,
    shipping_address: str,
    payment_method: str,
    items: List[Dict[str, Any]],
    total_amount: float,
    order_date: datetime | None = None,
) -> bytes:
    """
    Generate a PDF invoice and return raw bytes.
    """
    if order_date is None:
        order_date = datetime.now()

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
        title=f"Flipkart Invoice #{order_id}",
        author="Flipkart",
    )

    # ── Custom paragraph styles (prefixed to avoid built-in name conflicts) ─────
    def mk_style(name, **kwargs):
        """Create a ParagraphStyle inheriting from Normal."""
        base = dict(fontName="Helvetica", fontSize=10, textColor=DARK_TEXT, leading=14)
        base.update(kwargs)   # caller values override defaults — no duplicates
        return ParagraphStyle(f"FK_{name}", **base)

    hdr_title_style  = mk_style("HdrTitle",  fontSize=26, textColor=WHITE,
                                 fontName="Helvetica-Bold", alignment=TA_LEFT)
    hdr_invno_style  = mk_style("HdrInvNo",  fontSize=10, textColor=WHITE,
                                 alignment=TA_RIGHT)
    tagline_style    = mk_style("Tagline",   fontSize=10,
                                 textColor=colors.HexColor("#c8d8fb"),
                                 alignment=TA_CENTER)
    label_style      = mk_style("Label",     fontSize=9, textColor=GREY_TEXT,
                                 fontName="Helvetica-Bold")
    value_style      = mk_style("Value",     fontSize=9, textColor=DARK_TEXT)
    section_style    = mk_style("Section",   fontSize=11, textColor=FLIPKART_BLUE,
                                 fontName="Helvetica-Bold", spaceAfter=4)
    footer_style     = mk_style("Footer",    fontSize=8, textColor=GREY_TEXT,
                                 alignment=TA_CENTER)

    story = []

    # ── Header banner ──────────────────────────────────────────────────────────
    col_left  = PAGE_W * 0.60
    col_right = PAGE_W * 0.40

    header_data = [[
        Paragraph("Flipkart", hdr_title_style),
        Paragraph(f"INVOICE #{order_id:06d}", hdr_invno_style),
    ]]
    header_table = Table(header_data, colWidths=[col_left, col_right])
    header_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), FLIPKART_BLUE),
        ("TOPPADDING",    (0, 0), (-1, -1), 16),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(header_table)

    # Tagline bar
    tagline_table = Table(
        [[Paragraph("India's Online Marketplace", tagline_style)]],
        colWidths=[PAGE_W],
    )
    tagline_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), FLIPKART_DARK),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(tagline_table)
    story.append(Spacer(1, 8 * mm))

    # ── Order meta + Bill To ───────────────────────────────────────────────────
    half = PAGE_W / 2
    meta_info = [
        [Paragraph("ORDER DETAILS", label_style), Paragraph("BILL TO", label_style)],
        [
            Paragraph(f"Order ID: <b>#{order_id}</b>", value_style),
            Paragraph(f"<b>{user_name}</b>", value_style),
        ],
        [
            Paragraph(f"Date: <b>{order_date.strftime('%d %b %Y, %I:%M %p')}</b>", value_style),
            Paragraph(user_email, value_style),
        ],
        [
            Paragraph(f"Payment: <b>{payment_method}</b>", value_style),
            Paragraph(shipping_address.replace("\n", "<br/>"), value_style),
        ],
    ]
    meta_table = Table(meta_info, colWidths=[half, half])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0),  LIGHT_BLUE),
        ("BACKGROUND",    (0, 1), (-1, -1), LIGHT_GREY),
        ("TOPPADDING",    (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        ("GRID",          (0, 0), (-1, -1), 0.5, colors.HexColor("#dde3f0")),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8 * mm))

    # ── Items table ────────────────────────────────────────────────────────────
    story.append(Paragraph("ORDER ITEMS", section_style))
    story.append(HRFlowable(width="100%", thickness=2, color=FLIPKART_BLUE, spaceAfter=4))

    col_headers = ["#", "Product", "Unit Price", "Qty", "Subtotal"]
    rows = [col_headers]
    for idx, item in enumerate(items, start=1):
        unit = item["price"]
        qty  = item["quantity"]
        sub  = unit * qty
        rows.append([
            str(idx),
            item["name"],
            f"\u20b9{unit:,.0f}",
            str(qty),
            f"\u20b9{sub:,.0f}",
        ])

    # Totals rows
    rows.append(["", "", "", "Subtotal:",   f"\u20b9{total_amount:,.0f}"])
    rows.append(["", "", "", "Shipping:",   "FREE"])
    rows.append(["", "", "", "Grand Total:", f"\u20b9{total_amount:,.0f}"])

    # Column widths that sum to PAGE_W
    col_widths = [8 * mm, PAGE_W - 8*mm - 30*mm - 16*mm - 30*mm, 30*mm, 16*mm, 30*mm]
    items_table = Table(rows, colWidths=col_widths, repeatRows=1)
    items_table.setStyle(TableStyle([
        # Header row – blue bg, white text
        ("BACKGROUND",    (0, 0), (-1, 0),  FLIPKART_BLUE),
        ("TEXTCOLOR",     (0, 0), (-1, 0),  WHITE),
        ("FONTNAME",      (0, 0), (-1, 0),  "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, 0),  9),
        ("ALIGN",         (0, 0), (-1, 0),  "CENTER"),
        ("TOPPADDING",    (0, 0), (-1, 0),  8),
        ("BOTTOMPADDING", (0, 0), (-1, 0),  8),
        # Data rows
        ("FONTSIZE",      (0, 1), (-1, -4), 8),
        ("TOPPADDING",    (0, 1), (-1, -4), 6),
        ("BOTTOMPADDING", (0, 1), (-1, -4), 6),
        ("ROWBACKGROUNDS",(0, 1), (-1, -4), [WHITE, LIGHT_GREY]),
        ("ALIGN",         (2, 1), (-1, -4), "RIGHT"),
        ("ALIGN",         (0, 1), (0, -4),  "CENTER"),
        ("GRID",          (0, 0), (-1, -4), 0.4, colors.HexColor("#e0e0e0")),
        # Totals (last 3 rows)
        ("SPAN",          (0, -3), (2, -3)),
        ("SPAN",          (0, -2), (2, -2)),
        ("SPAN",          (0, -1), (2, -1)),
        ("FONTNAME",      (3, -3), (-1, -2), "Helvetica"),
        ("FONTNAME",      (3, -1), (-1, -1), "Helvetica-Bold"),
        ("FONTSIZE",      (3, -3), (-1, -1), 9),
        ("FONTSIZE",      (3, -1), (-1, -1), 11),
        ("TEXTCOLOR",     (3, -1), (-1, -1), FLIPKART_BLUE),
        ("TOPPADDING",    (0, -3), (-1, -1), 6),
        ("BOTTOMPADDING", (0, -3), (-1, -1), 6),
        ("ALIGN",         (3, -3), (-1, -1), "RIGHT"),
        ("LINEABOVE",     (0, -3), (-1, -3), 1.0, colors.HexColor("#cccccc")),
        ("LINEABOVE",     (0, -1), (-1, -1), 1.5, FLIPKART_BLUE),
        ("BACKGROUND",    (0, -1), (-1, -1), LIGHT_BLUE),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 10 * mm))

    # ── Footer ─────────────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=0.5, color=GREY_TEXT))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(
        "Thank you for shopping with Flipkart!  |  "
        "This is a computer-generated invoice and does not require a signature.",
        footer_style,
    ))
    story.append(Paragraph(
        "© Flipkart  •  For support, visit flipkart.com/help",
        footer_style,
    ))

    doc.build(story)
    return buffer.getvalue()
