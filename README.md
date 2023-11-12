<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Descripción

Documentación sobre el Challenge.
Se puede acceder a una versión online desde acá https://conexa-challenge.up.railway.app/docs

## Requisitos

- Tener instalado Node 16+ y el CLI de Nestjs
- Tener una base de datos de MongoDB ya sea local o en otro servidor, para utilizarla sobreescribir la variable de
  entorno MONGODB_URI en un archivo .env
- Tener instalado Docker para ejecutar una instancia de MongoDB de forma local con
  ```docker-compose up```

## Instalación

```bash
$ npm install
```

## Ejecución

Los servicios disponibles son ```main```,```user```,```auth```y```movie```

```bash
# development
$ npm run start [service]

# watch mode
$ npm run start:dev [service]

# debug mode
$ npm run start:debug [service]

# production mode
$ npm run start:prod [service]
```

## Test

```bash
# unit tests
$ npm run test

# watch unit tests
$ npm run test:watch

# test coverage
$ npm run test:cov
```

## Arquitectura

La arquitectura de este proyecto está basada en la de microservicios interconectados a través de la capa TCP. El código
reside en un monorepo, donde los microservicios coexisten para facilitar el intercambio de módulos, clases e interfaces.

Los cuatro microservicios principales están ubicados en la carpeta `/apps`, junto con otra carpeta `/libs` que integra
elementos compartidos entre los microservicios. Esta compartición incluye la gestión de excepciones y funcionalidades
generales de bases de datos.

Dentro de la carpeta /apps, donde se encuentran los microservicios junto con el API Gateway, cada uno sigue los
principios de Clean Architecture. Esto implica una separación en capas de `domain`, `application`, e `infrastructure`.
La capa de dominio alberga los elementos del dominio de la solución (Entidades, DTO, interfaces); la capa de aplicación
se compone de la lógica de negocios (Servicios, potencialmente casos de uso); y la capa de infraestructura engloba
detalles de implementación, como la gestión de bases de datos, conexiones con servicios externos y adaptadores que
implementan interfaces definidas en la capa de dominio (Repositorios). La secuencia de dependencias entre capas es
Domain > Application > Infrastructure.

Este enfoque mejora la mantenibilidad, las pruebas y la evolución del sistema a lo largo del tiempo. La inyección de
dependencias utilizada en todo el proyecto facilita las pruebas y la independencia de herramientas, como las bases de
datos, permitiendo que el sistema opere de manera lo más independiente posible.

## Microservicios

Los microservicios definidos son:

- **Main**: Actúa como un API Gateway, siendo el único punto de acceso a los demás servicios. Gestionando el acceso
  basado en roles a través de sus controladores.
- **User**: Maneja las operaciones relacionadas con los usuarios (crear, buscar, actualizar y eliminar). El API Gateway
  solo implementa la operación de actualizar Usuario, solamente con el objetivo de poder modificar los roles del usuario
  de prueba más facilmente, pero las operaciones creación de Usuario son delegadas a Auth.
- **Auth**: Gestiona las operaciones de autenticación y autorización, generando también los Access Token.
- **Movie**: Maneja las operaciones relacionadas con las películas y utiliza la API de Star Wars para obtener
  información que se almacena en la base de datos. Solo los usuarios administradores pueden realizar operaciones de
  creación, actualización o eliminación.

Cada microservicio proporciona un Proxy, que es una implementación de la interfaz de los servicios que ofrece. Esto es
lo único que los conecta entre sí. Al ser una implementación de esta interfaz, el uso de cada servicio en los demás es
completamente transparente.
