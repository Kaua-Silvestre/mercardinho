# Mercadinho Perto — site acessível

Demonstração de uma loja de mercado feita com HTML semântico, CSS responsivo e JavaScript puro. Não utiliza frameworks, bibliotecas, fontes externas, serviços externos ou etapa de build.

## Como executar

1. Extraia a pasta do projeto, se necessário.
2. Abra `index.html` em um navegador atualizado.
3. Para desenvolvimento local, também é possível servir a pasta com um servidor estático, por exemplo `python -m http.server 8000`, e acessar `http://localhost:8000`.

## Funcionalidades incluídas

- Busca por nome, categoria e descrição.
- Filtros por categoria.
- Carrinho com adição, remoção, alteração de quantidade e subtotal.
- Resumo demonstrativo do pedido; nenhuma compra ou cobrança é enviada.
- Opções de acessibilidade: texto ajustável, alto contraste, leitura simplificada e leitura em voz alta usando a API de síntese de fala do navegador quando disponível.
- Navegação por teclado, link para pular ao conteúdo, foco visível, rótulos acessíveis, mensagens de status e suporte à preferência de movimento reduzido.
- Layout adaptável a telas grandes, tablets e celulares.

## Limitações intencionais

Este projeto é apenas frontend. Produtos e preços estão definidos em `app.js`; não representam estoque ou preços reais. O carrinho existe apenas durante a sessão da página. Não há backend, banco de dados, login, checkout real, pagamento, entrega ou persistência. A leitura em voz alta depende do suporte do navegador e do dispositivo.

## Estrutura

- `index.html` — estrutura e conteúdo semântico.
- `styles.css` — apresentação, responsividade e estados visuais de acessibilidade.
- `app.js` — catálogo de exemplo, busca, filtros, carrinho e controles de acessibilidade.
