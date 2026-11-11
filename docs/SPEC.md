# Especificações do Projeto

## Otimizador de Caixas de Papelão e Embalagens (Minimização de Área de Superfície)

- **O Conceito:** Encontrar as dimensões ótimas (largura $x$, altura $y$, comprimento $z$) de uma caixa retangular para conter um volume fixo $V$, de modo a **minimizar a área total de papelão** utilizada (o que reduz o custo de matéria-prima).
    
- **A Formulação Geométrica:**
    
    - **Função Objetivo:** Minimizar a área $A = 2xy + 2yz + 2xz$ (um posinômio).
        
    - **Restrição:** $xyz = V$ (um monômio igual a uma constante).
        
- **Por que é simples de implementar:** Como a restrição é de igualdade do tipo monômio, este problema pode ser resolvido analiticamente usando multiplicadores de Lagrange ou propriedades de média aritmética e geométrica (AM-GM), resultando em fórmulas diretas (ex: cubos perfeitos ou proporções fixas de proporção áurea dependendo das restrições laterais). Você pode construir um script de 20 linhas que recebe o volume e cospe as dimensões perfeitas.
