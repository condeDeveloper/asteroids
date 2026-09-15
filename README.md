# ☄️ Asteroids

Asteroids em HTML5 Canvas + JavaScript puro, com gráficos vetoriais em linha como no arcade de 1979. Sem dependências, sem build.

**Jogar online:** https://condedeveloper.github.io/asteroids/

## Rodar local

```bash
npx serve -l 5194 .
```

## Controles

| Ação         | Tecla / botão          |
|--------------|------------------------|
| Girar        | ← → ou A D             |
| Acelerar     | ↑ ou W                 |
| Atirar       | Espaço                 |
| Hiperespaço  | Shift ou H (recarga 4 s) |
| Pausar       | P ou Esc               |

No celular aparecem cinco botões na tela.

## Funcionalidades

- Nave com inércia, atrito leve e velocidade máxima
- Mundo toroidal: tudo atravessa as bordas, inclusive a detecção de colisão
- Asteroides com contornos irregulares aleatórios, que se dividem em dois ao serem atingidos (grande → médio → pequeno)
- Pontuação clássica: 20, 50 e 100 pontos. Vida extra a cada 10.000
- Hiperespaço com recarga e breve invulnerabilidade
- Renascimento com piscada de invulnerabilidade e área livre garantida
- Destroços da nave se separam em linhas ao morrer
- Batida grave de fundo que acelera com as ondas, ruído de propulsor, explosões filtradas
- Hi-Score no `localStorage`

## Estrutura

```
js/config.js     # constantes
js/vec.js        # wrap toroidal, distância, spawn
js/ship.js       # nave
js/asteroid.js   # asteroides e divisão
js/bullet.js     # projéteis
js/particles.js  # fragmentos e destroços
js/render.js     # vetores e HUD
js/audio.js      # sons
js/input.js      # teclado e toque
js/game.js       # ondas, vidas, loop
```

## Licença

MIT
