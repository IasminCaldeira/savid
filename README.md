# SAVID Aromatics — E-commerce

Site multi-página em HTML5 + CSS3 + JavaScript puro, fiel ao protótipo Figma.

## Estrutura

```
savid-site/
├── index.html         Home
├── produtos.html      Catálogo de velas
├── kits.html          Catálogo de kits
├── sobre.html         Quem somos / missão / visão / valores
├── usuario.html       Login & cadastro
├── carrinho.html      Carrinho de compras
├── produto.html       Página individual (?id=...)
├── data/products.js   Catálogo (edite aqui produtos e kits)
└── assets/
    ├── css/style.css  Design system + responsivo
    ├── js/main.js     Header/footer/cart/render
    ├── logo.png       Logo oficial Savid
    └── *.png          Banners
```

## Rodar
Abra a pasta no VS Code e use **Live Server** (clique direito no `index.html` -> Open with Live Server). Ou apenas dê duplo clique em `index.html`.

## Editar produtos
Tudo está em `data/products.js`. Cada item tem `id`, `nome`, `preco`, `imagem`, `categoria` (`vela` ou `kit`) e `destaque` (boolean, aparece na home).

## Editar logo / banners
Substitua os arquivos em `assets/` mantendo os mesmos nomes.

## Carrinho
Persistido em `localStorage` (`savid_cart_v1`).
