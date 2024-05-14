<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A SCRUD module for Nest framework (node.js) using awesome tips for projects
</p>

<p align="center">
  <a href="https://www.npmjs.com/org/streamkits"><img src="https://img.shields.io/npm/l/@streamkits/nestjs_module_scrud.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/org/streamkits"><img src="https://img.shields.io/npm/l/@streamkits/nestjs_module_scrud.svg" alt="Package License" /></a>
  <a href="https://github.com/StreamKITS/nestjs_module_scrud/actions/workflows/ci.yml"><img src="https://github.com/StreamKITS/nestjs_module_scrud/actions/workflows/ci.yml/badge.svg" alt="Publish Package to npmjs" /></a>
</p>
<br>

# NestJS SCRUD Module
SCRUD module for NestJS Framework

## Install dependencies
```bash
yarn add @streamkits/nestjs_module_scrud
```

## Usages
### Filters
#### Syntax
`filters[PREFIX + FIELD]=SEARCH`
#### Example
`filters[=subject]=53`
subject field equal to 53
#### Usage
```bash
curl --request GET \
  --url 'http://localhost/search?limit=9999&filters%5B%5Esequence%5D=%2F53%2F&sort%5Bmetadata.createdAt%5D=-1&sort%5Bsubject%5D=1'
  
# limit=9999
# filters[^sequence]=/53/
# sort[metadata.createdAt]=-1
# sort[subject]=1
```
#### List
| Filter | Description           |
|--------|-----------------------|
| :      | Equal                 |
| #      | Number Equal          |
| !#     | Number Not Equal      |
| !:     | Not Equal             |
| \>     | Greater Than          |
| \>|    | Greater Than or Equal |
| \<     | Less Than             |
| \<|    | Less Than or Equal    |
| @      | in                    |
| !@     | not in                |
| @#     | number in             |
| !@#    | number not in         |
| \^     | regex                 |
