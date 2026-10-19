---
title: "Palettes plastique pour AGV et AMR : définissez l’interface de charge"
description: "Distinguez AGV à fourches, AMR lève-palette, robots à plateau et automatisation fixe avant de définir géométrie, détection, stations et essai en charge."
layout: "resources/"
cover_image: "images/resources/2609-automation-ready-plastic-pallet-specification.webp"
cover_alt: "Palette plastique franchissant une interface d’entrepôt automatisé"
categories: "articles"
tags: ["palette plastique AGV", "interface palette AMR", "chariot autonome", "automatisation d’entrepôt"]
reading: "8 min"
file_size: ""
date: 2026-04-14
lastmod: 2026-10-19
popular: false
---

« Compatible AGV/AMR » n’est pas une spécification complète de palette plastique. Un véhicule autonome à fourches aborde la palette par ses entrées. Un robot lève-palette peut la prendre avec un module et une station dédiés. Un robot à plateau soutient la charge par une surface ou un module supérieur définis. Les convoyeurs et les systèmes AS/RS ajoutent encore d’autres contacts inférieurs et transferts.

La décision d’achat ne consiste donc pas à savoir si une palette convient à « l’automatisation » en général. Il faut déterminer si une spécification maîtrisée de palette et d’unité de charge peut être détectée, prise, transportée, transférée et déposée sur le **parcours automatisé réel**.

## Identifiez d’abord l’architecture de manutention

Demandez au fournisseur du robot ou à l’intégrateur de nommer le véhicule, l’accessoire, la configuration concernée, les stations de prise/dépose et l’interface de charge. L’exemple d’un fabricant ne constitue pas une règle universelle.

| Architecture | Questions d’interface à résoudre avant l’appel d’offres palette |
|---|---|
| AGV à fourches, transpalette ou chariot autonome | Côtés d’entrée ; longueur, épaisseur, largeur, écartement et levée des fourches ; tolérance d’approche ; nervures et semelles ; mode de détection ; modèle de référence ; emplacement de prise et de dépose |
| AMR lève-palette | Format et appui approuvés ; contact du lève-palette ou du module supérieur ; station ou support compatible ; centrage et accostage ; maintien de la charge ; dégagement à la prise et en déplacement |
| Robot mobile à plateau ou sous-charge | Enveloppe de la surface ou du module ; empreinte soutenue ; limites du centre de gravité ; éléments de positionnement ; débord ; zones de détection ; maintien et transfert de la palette ou du support |
| Convoyeur, table élévatrice, palettiseur, navette ou AS/RS | Contact rouleaux, chaînes, rails ou levage ; jeux de transfert ; direction et bord d’attaque ; flèche selon l’appui ; position des capteurs et butées |

La norme publiée [ISO 3691-4:2023](https://www.iso.org/standard/83545.html) traite des exigences de sécurité des chariots sans conducteur et de leurs systèmes. Elle cite notamment AGV, AMR, chariots automatisés et véhicules passant sous la charge, et souligne l’importance de la zone d’exploitation. La page ISO indique qu’une révision est en préparation. Cette norme ne certifie pas une palette et ne l’approuve pas pour un robot ou un entrepôt donné.

Les informations d’équipement montrent pourquoi l’architecture doit être nommée. La [fiche du MiR600](https://mobile-industrial-robots.com/products/robots/mir600/specifications) publie pour ce modèle une surface de charge, une charge utile, des conditions de positionnement et d’environnement, ainsi que des caméras 3D pour détecter palettes et obstacles. BALYO décrit une autre interface pour son [chariot à mât rétractable autonome REACHY](https://www.balyo.com/agv-reach-trucks/reachy) : des caméras sous les fourches comparent l’image à un modèle de palette de référence et le système peut corriger la position des fourches. Ce sont des exemples d’équipements, pas des recommandations ni une preuve qu’une palette non définie convient.

## Constituez le dossier d’interface avant de comparer les offres

L’acheteur et l’intégrateur doivent d’abord figer :

- robot, véhicule, accessoire, configuration ou firmware concerné et intégrateur responsable ;
- plan de la palette, sens d’entrée, ouvertures, semelles, pieds, nervures, hauteur du plateau et zones soutenues ;
- masse à vide et enveloppes minimale, normale et maximale de l’unité de charge ;
- répartition, débord, centre de gravité, maintien et éléments susceptibles de bouger ou de masquer une zone de détection ;
- plans des points de prise, dépose, rayonnage, convoyeur, machine et zone tampon ;
- éléments à détecter, positions des étiquettes ou codes et surfaces devant rester visibles ;
- sol, pente, joints, température, eau, huile, poussière et lavage dans les limites autorisées par le fournisseur de l’équipement ;
- règles d’arrêt, gestion des exceptions, reprise manuelle, quarantaine et responsabilité des modifications.

Le format nominal et la charge catalogue ne suffisent pas. Une palette 1200 × 1000 mm peut échouer si une fourche touche une nervure, si la charge cache une référence de détection, si la base n’est pas soutenue lors d’un transfert ou si la tolérance de dépose est inférieure aux variations cumulées de la palette et du système.

Pour les dimensions d’entrée avec engins manuels ou motorisés, partez de la [fiche de contrôle des entrées de fourches](/fr/resources/insights/260713-plastic-pallet-fork-entry-clearance-test/). Si le parcours comprend des convoyeurs fixes, ajoutez les [contrôles du contact inférieur](/fr/resources/insights/2640-plastic-pallet-conveyor-bottom-contact-checks/). La réussite d’une interface n’approuve pas l’autre.

## Menez un essai en charge délimité

La méthode doit être convenue entre l’intégrateur, l’équipe sécurité du site et l’acheteur. Ne neutralisez ni champs de protection, ni capteurs, ni verrouillages, ni limites nominales, ni instructions du fabricant.

1. **Figez le candidat.** Notez modèle ou révision du plan, matière, renforts, charge, configuration du robot et de l’accessoire, stations et parcours.
2. **Vérifiez l’interface à vide.** Contrôlez détection, approche, entrée ou appui, levée, déplacement, transfert et dépose, sans frottement, contact forcé, appui instable ni contournement improvisé.
3. **Répétez avec des charges représentatives.** Couvrez l’enveloppe et la répartition approuvées. N’incluez une charge partielle ou décentrée que si elle est prévue et si l’intégrateur a défini une condition d’essai sûre.
4. **Observez chaque transfert.** Relevez erreurs de prise/dépose, contacts, flèche, mouvement de charge, détections manquées, cycles refusés, arrêts et reprises manuelles.
5. **Appliquez les règles d’arrêt.** Suspendez après contact inexpliqué, instabilité, dommage, échec répété de détection, mouvement dangereux ou sortie de l’enveloppe autorisée.
6. **Contrôlez la répétabilité des lots.** Transférez dimensions et critères visuels critiques dans un [plan de contrôle à réception](/fr/resources/insights/2617-plastic-pallet-incoming-inspection-plan/). Un bon échantillon ne définit pas les lots suivants.

Il n’existe ni quantité d’échantillons universelle ni calendrier obligatoire de six semaines. Fixez quantité et durée selon la variation de production, la fréquence du parcours, les cas de charge, l’environnement et les preuves nécessaires. Le [cadre d’essai pilote](/fr/resources/insights/2604-plastic-pallet-pilot-program/) relie le parcours à la répétabilité des lots sans promettre une durée arbitraire.

## Consignez une approbation limitée

Un résultat utile peut préciser : « approuvé pour le plan A, l’enveloppe de charge B, la configuration robot/accessoire C, les stations D à F et les sens d’entrée indiqués ». Il doit également exclure clairement les charges, stations, environnements et reprises non couverts.

Réexaminez l’interface si changent le plan, la matière, le renfort, le moule, l’unité de charge, le robot, l’accessoire, la configuration, la détection, la station, le convoyeur, le rayonnage ou le parcours. Une modification ne signifie pas automatiquement un échec, mais l’ancien essai ne couvre plus automatiquement la nouvelle condition.

## Informations à joindre à votre demande

Envoyez dimensions, sens d’entrée, plage et répartition de charge, modèle du robot et de l’accessoire, plans de prise/dépose, photos ou vidéos partageables, limites d’environnement, quantité et port de destination. Baoheng Plastic peut s’appuyer sur l’application, la charge, la manutention et le stockage confirmés pour aider à comparer les [structures de palettes plastique](/fr/products/pallets/) disponibles et préparer les informations du modèle pour l’examen piloté par l’intégrateur. L’approbation finale AGV/AMR et site reste propre à l’équipement, la palette, la charge et le parcours exacts.

Lorsque ce dossier est prêt, transmettez-le via le [formulaire de demande](/fr/contact/).

