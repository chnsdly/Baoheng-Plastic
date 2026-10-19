---
title: "Palés de plástico para AGV y AMR: defina la interfaz de carga"
description: "Separe AGV con horquillas, AMR con elevador de palés, robots de plataforma y automatización fija antes de especificar geometría, detección, estaciones y una prueba de ruta con carga."
layout: "resources/"
cover_image: "images/resources/2609-automation-ready-plastic-pallet-specification.webp"
cover_alt: "Palé de plástico atravesando una interfaz de almacén automatizado"
categories: "articles"
tags: ["palé de plástico AGV", "interfaz de palé AMR", "carretilla autónoma", "automatización de almacenes"]
reading: "8 min"
file_size: ""
date: 2026-04-14
lastmod: 2026-10-19
popular: false
---

«Compatible con AGV/AMR» no es una especificación completa para un palé de plástico. Un vehículo autónomo con horquillas entra por las aberturas del palé. Un robot elevador puede recogerlo mediante un módulo y una estación específicos. Un robot de plataforma sostiene la carga sobre una superficie o módulo superior definidos. Los transportadores y los sistemas AS/RS añaden otras condiciones de contacto inferior y transferencia.

La decisión de compra no consiste, por tanto, en saber si un palé funciona con la «automatización» en general. Hay que demostrar si una especificación controlada de palé y unidad de carga puede detectarse, recogerse, transportarse, transferirse y depositarse en la **ruta automatizada real**.

## Identifique primero la arquitectura de manipulación

Pida al proveedor del robot o al integrador que identifique el vehículo, el accesorio, la configuración pertinente, las estaciones de recogida y entrega y la interfaz de carga. No convierta el ejemplo de un fabricante en una regla universal.

| Arquitectura | Preguntas de interfaz que deben resolverse antes de solicitar el palé |
|---|---|
| AGV con horquillas, transpaleta o carretilla autónoma | Lados de entrada; longitud, espesor, anchura, separación y altura de las horquillas; tolerancia de aproximación; nervios y patines inferiores; método de detección; modelo de referencia; lugar de recogida y depósito |
| AMR con elevador de palés | Tamaño y apoyo aprobados; contacto con el elevador o módulo superior; estación o bastidor compatible; centrado y acoplamiento; sujeción de la carga; holgura durante la recogida y el recorrido |
| Robot móvil de plataforma o bajo carga | Envolvente de la superficie o módulo; huella apoyada; límites del centro de gravedad; elementos de localización; voladizo; zonas de detección; sujeción y transferencia del palé o portacargas |
| Transportador, mesa elevadora, paletizador, shuttle o AS/RS | Contacto con rodillos, cadenas, raíles o elevadores; huecos de transferencia; dirección y borde de ataque; flexión en cada apoyo; posición de sensores y topes |

La edición publicada [ISO 3691-4:2023](https://www.iso.org/standard/83545.html) trata los requisitos de seguridad de los vehículos industriales sin conductor y sus sistemas, e incluye entre sus ejemplos AGV, AMR, carros automatizados y vehículos que circulan bajo la carga. También señala la importancia de la zona de operación. La página de ISO indica que existe una revisión en desarrollo. La norma no certifica palés ni aprueba uno para un robot o almacén concreto.

La información de equipos muestra por qué debe identificarse la arquitectura. La [especificación del MiR600](https://mobile-industrial-robots.com/products/robots/mir600/specifications) publica para ese modelo una superficie de carga, carga útil, condiciones de posicionamiento y entorno, además de cámaras 3D para detectar palés y obstáculos. BALYO describe otra interfaz en su [carretilla retráctil autónoma REACHY](https://www.balyo.com/agv-reach-trucks/reachy): las cámaras situadas bajo las horquillas comparan la imagen con un modelo de palé de referencia y el sistema puede ajustar la posición de las horquillas. Son ejemplos de equipos, no recomendaciones ni pruebas de compatibilidad de un palé no especificado.

## Prepare el expediente de interfaz antes de comparar ofertas

El comprador y el integrador deben fijar primero:

- robot, vehículo, accesorio, configuración o firmware pertinente e integrador responsable;
- plano del palé, dirección de entrada, aberturas, patines, patas, nervios, altura de la plataforma y zonas apoyadas;
- masa del palé vacío y envolventes mínima, normal y máxima de la unidad de carga;
- distribución, voladizo, centro de gravedad, contención y elementos que puedan moverse o entrar en una zona de detección;
- planos de recogida, depósito, estantería, transportador, máquina y estación intermedia;
- elementos que deben detectarse, posición de etiquetas o códigos y superficies que deben permanecer visibles;
- suelo, pendiente, juntas, temperatura, agua, aceite, polvo y lavado dentro del alcance permitido por el proveedor del equipo;
- reglas de parada, tratamiento de excepciones, recuperación manual, cuarentena y responsables de cambios.

La medida nominal y la carga de catálogo no bastan. Un palé de 1200 × 1000 mm puede fallar si una horquilla toca un nervio, la carga oculta una referencia de detección, falta apoyo en una transferencia o la tolerancia de depósito es menor que la variación conjunta del palé y del sistema.

Para dimensiones de entrada con equipos manuales o motorizados, use como punto de partida el [registro de holgura de horquillas](/es/resources/insights/260713-plastic-pallet-fork-entry-clearance-test/). Si la ruta incluye transportadores fijos, añada las [comprobaciones de contacto inferior](/es/resources/insights/2640-plastic-pallet-conveyor-bottom-contact-checks/). Aprobar una interfaz no aprueba la otra.

## Realice una prueba delimitada de la ruta con carga

El integrador, el equipo de seguridad de la instalación y el comprador deben acordar el método. No se deben anular campos de protección, sensores, enclavamientos, límites nominales ni instrucciones del fabricante.

1. **Congele el candidato.** Registre modelo o revisión del plano, material, refuerzos, carga, configuración del robot y accesorio, estaciones y ruta.
2. **Compruebe la interfaz en vacío.** Verifique detección, aproximación, entrada o apoyo, elevación, recorrido, transferencia y depósito sin roce, contacto forzado, apoyo inestable ni maniobras improvisadas.
3. **Repita con cargas representativas.** Cubra la envolvente y distribución aprobadas. Incluya cargas parciales o descentradas solo si se esperan y el integrador ha definido una prueba segura.
4. **Observe cada transferencia.** Registre error de recogida y colocación, contacto, flexión, movimiento de carga, fallos de detección, ciclos rechazados, paradas y recuperación manual.
5. **Aplique reglas de parada.** Detenga la prueba ante contacto sin explicación, inestabilidad, daños, fallos repetidos de detección, movimiento inseguro o uso fuera de la envolvente aprobada.
6. **Compruebe la repetibilidad del lote.** Pase las dimensiones y condiciones visuales críticas a un [plan de inspección de entrada](/es/resources/insights/2617-plastic-pallet-incoming-inspection-plan/). Una muestra correcta no define los lotes posteriores.

No existe un número universal de muestras ni un calendario obligatorio de seis semanas. Defina cantidad y duración según la variación de producción, la frecuencia de la ruta, los casos de carga, el entorno y la evidencia necesaria. El [marco de prueba piloto](/es/resources/insights/2604-plastic-pallet-pilot-program/) conecta la ruta con la repetibilidad del lote sin prometer un plazo arbitrario.

## Documente una aprobación limitada

Un resultado útil puede decir: «aprobado para el plano A, envolvente de carga B, configuración de robot y accesorio C, estaciones D–F y direcciones de entrada indicadas». Debe listar también cargas, estaciones, entornos y métodos de recuperación excluidos.

Revise de nuevo la interfaz cuando cambien el plano, material, refuerzo, molde, unidad de carga, robot, accesorio, configuración, detección, estación, transportador, estantería o ruta. Un cambio no implica automáticamente un fallo, pero la prueba anterior deja de cubrirlo por defecto.

## Qué enviar con la consulta

Envíe dimensiones, direcciones de entrada, rango y distribución de la carga, modelo de robot y accesorio, planos de recogida y depósito, fotos o vídeos que pueda compartir, límites ambientales, cantidad y puerto de destino. Baoheng Plastic puede usar las condiciones confirmadas de aplicación, carga, manipulación y estantería para ayudar a comparar [estructuras de palés de plástico](/es/products/pallets/) disponibles y preparar información del modelo para la revisión dirigida por el integrador. La aprobación final del AGV/AMR y de la instalación siempre depende del equipo, palé, carga y ruta exactos.

Cuando tenga el expediente de interfaz, envíelo mediante el [formulario de consulta](/es/contact/).

