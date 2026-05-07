from weasyprint import HTML
from datetime import datetime

def generate_pdf_report(findings: list, title: str = "BankGuard Security Report") -> bytes:
    rows = "".join(
        f"<tr><td>{f.get('filepath','')}</td><td>{f.get('category','')}</td>"
        f"<td>{f.get('severity','')}</td><td>{f.get('risk_score','')}</td></tr>"
        for f in findings
    )
    html = f"""
    <html><head><style>
      body {{ font-family: Arial; font-size: 12px; }}
      h1 {{ color: #1a3c5e; }}
      table {{ width: 100%; border-collapse: collapse; }}
      th, td {{ border: 1px solid #ccc; padding: 6px; text-align: left; }}
      th {{ background: #1a3c5e; color: white; }}
    </style></head><body>
      <h1>{title}</h1>
      <p>Generated: {datetime.utcnow().isoformat()} UTC</p>
      <table>
        <tr><th>File</th><th>Category</th><th>Severity</th><th>Risk Score</th></tr>
        {rows}
      </table>
    </body></html>"""
    return HTML(string=html).write_pdf()
