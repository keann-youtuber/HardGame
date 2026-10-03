# HardGame

RPG online 2D top-down para navegador, pensado para PC e mobile.

## Protótipo atual
- Canvas fullscreen responsivo.
- Mundo procedural determinístico por seed.
- Biomas: floresta, água, areia, montanha e região morta.
- Árvores, minérios, cavernas, cidades, baús e monstros.
- HP, MAN (mana), AURA, ouro, nível, madeira e minério.
- Espada, magia, arco (base de controle), bloqueio e perfect block.
- Regeneração, inimigos perseguidores, loot e morte com perda de ouro.
- Salvamento local por navegador.

## Arquitetura online
GitHub guarda o cliente e arquivos estáticos. GitHub não deve ser usado como banco de dados de jogadores nem como servidor de partida em tempo real.

Para login Google/Discord e multiplayer real será necessário um backend/API. Se Cloudflare for apenas hospedagem, esse backend precisa ser externo; se aceitarmos Cloudflare Workers + D1/KV, podemos manter a infraestrutura praticamente toda na Cloudflare.

## Controles
WASD mover · Mouse/E atacar · Q magia · R arco · Espaço bloquear · F interagir.

## Próximas camadas
Servidor autoritativo WebSocket, OAuth Google/Discord, contas persistentes, chunk streaming, party/guild/chat, economia, crafting, leilão, classes, atributos, armas, armaduras, árvores de magia, bosses e anti-cheat.
