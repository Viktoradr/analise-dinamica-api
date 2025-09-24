import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>API — Analise Dinâmica</title>
  <style>
    :root{
      --bg:#0f1724;
      --card:#0b1220;
      --muted:#9aa7bb;
      --accent:#6ee7b7;
      --glass: rgba(255,255,255,0.04);
      --glass-2: rgba(255,255,255,0.03);
      --radius: 12px;
      --shadow: 0 6px 18px rgba(2,6,23,0.6);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }

    html,body{
      height:100%;
      margin:0;
      background:
        radial-gradient(1200px 600px at 10% 10%, rgba(110,231,183,0.06), transparent 8%),
        radial-gradient(1000px 500px at 90% 90%, rgba(99,102,241,0.04), transparent 8%),
        var(--bg);
      color:#e6eef6;
      -webkit-font-smoothing:antialiased;
      -moz-osx-font-smoothing:grayscale;
    }

    .wrap{
      max-width:1100px;
      margin:48px auto;
      padding:28px;
    }

    header{
      display:flex;
      align-items:center;
      gap:18px;
      margin-bottom:20px;
    }

    .logo{
      width:64px;
      height:64px;
      border-radius:14px;
      background:linear-gradient(135deg, #60a5fa, #7c3aed);
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow: 0 6px 18px rgba(99,102,241,0.18);
      font-weight:700;
      font-size:20px;
      color:white;
    }

    h1{ margin:0; font-size:22px; letter-spacing: -0.2px; }
    p.lead{ margin:6px 0 0; color:var(--muted); font-size:13px; }

    .grid{
      display:grid;
      grid-template-columns: 1fr 360px;
      gap:20px;
      margin-top:22px;
    }

    .card{
      background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
      border-radius:var(--radius);
      padding:20px;
      box-shadow: var(--shadow);
      border: 1px solid rgba(255,255,255,0.03);
      backdrop-filter: blur(6px);
    }

    .status-row{
      display:flex;
      gap:12px;
      align-items:center;
      margin-top:12px;
    }

    .status-bubble{
      width:14px;
      height:14px;
      border-radius:50%;
      background: #f97316;
      box-shadow:0 6px 18px rgba(249,115,22,0.18);
    }
    .status-ok{ background: #10b981; box-shadow:0 6px 18px rgba(16,185,129,0.16); }
    .status-down{ background: #ef4444; box-shadow:0 6px 18px rgba(239,68,68,0.12); }
    .status-text{ font-weight:600; margin-left:6px; }

    .small{ color:var(--muted); font-size:13px; }

    .actions{ display:flex; gap:10px; margin-top:16px; flex-wrap:wrap; }
    .btn{
      padding:10px 14px;
      border-radius:10px;
      border:0;
      cursor:pointer;
      font-weight:600;
      background:linear-gradient(90deg,#111827, #0b1220);
      color:var(--accent);
      box-shadow: 0 8px 20px rgba(2,6,23,0.6);
      transition: transform .12s ease, opacity .12s ease;
      text-decoration:none;
      display:inline-flex;
      align-items:center;
      gap:8px;
    }
    .btn:hover{ transform: translateY(-3px); }
    .btn.ghost{ background:transparent; color:var(--muted); border:1px solid rgba(255,255,255,0.03); }
    .btn.primary{ background:linear-gradient(90deg,#06b6d4,#7c3aed); color:white; box-shadow: 0 10px 30px rgba(99,102,241,0.14); }

    .meta-list{ display:flex; gap:12px; flex-wrap:wrap; margin-top:12px; }

    .meta{
      background:var(--glass);
      padding:10px 12px;
      border-radius:10px;
      font-size:13px;
      color:var(--muted);
    }

    footer{ margin-top:22px; color:var(--muted); font-size:13px; text-align:center; }

    @media (max-width:920px){
      .grid{ grid-template-columns: 1fr; }
      .logo{ width:56px; height:56px; font-size:18px; border-radius:10px; }
    }

    /* little spinner */
    .spinner {
      width:18px;height:18px;border-radius:50%;
      border:2px solid rgba(255,255,255,0.08);
      border-top-color: rgba(255,255,255,0.22);
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="logo">AD</div>
      <div>
        <h1>Analise Dinâmica — API</h1>
        <p class="lead">Bem-vindo! Esta página mostra o status da API e links úteis (docs, endpoints). Servida pelo NestJS.</p>
      </div>
    </header>
  </div>
</body>
</html>`;
  }
}
