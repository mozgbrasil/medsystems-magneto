function routesConfig(t,o,e){o.otherwise("/produtos"),t.state("app",{abstract:!0,url:"",component:"app"}).state("app.produtos",{url:"/produtos",component:"produtos"}).state("app.importacao",{url:"/importacao",component:"importacao"}).state("app.estoque",{url:"/estoque",component:"estoque"}).state("app.preco",{url:"/preco",component:"preco"})}routesConfig.$inject=["$stateProvider","$urlRouterProvider","$locationProvider"],angular.module("app",["ui.router"]),angular.module("app").service("PrecoService",["$http",function(t){this.preco=function(){return t.post("/api/price-import.php")}}]),angular.module("app").component("preco",{templateUrl:"app/04-preco/preco.html",controller:["PrecoService",function(t){var o=this;o.preco=function(){o.loading=!0,t.preco().then(function(t){o.log=t.data,o.loading=!1})}}]}),angular.module("app").service("EstoqueService",["$http",function(t){this.estoque=function(){return t.post("/api/stock-import.php")}}]),angular.module("app").component("estoque",{templateUrl:"app/03-estoque/estoque.html",controller:["EstoqueService",function(t){var o=this;o.estoque=function(){o.loading=!0,t.estoque().then(function(t){o.log=t.data,o.loading=!1})}}]}),angular.module("app").service("ImportacaoService",["$http",function(t){this.categorias=function(){return t.post("/api/category-import.php")}}]),angular.module("app").component("importacao",{templateUrl:"app/02-importacao/importacao.html",controller:["ImportacaoService",function(t){var o=this;o.categorias=function(){o.loading=!0,t.categorias().then(function(t){o.log=t.data,o.loading=!1})}}]}),angular.module("app").service("ProdutosService",["$http",function(t){var o=this;o.grupos=function(){return t.post("/api/grupos.php")},o.categorias=function(){return t.post("/api/categorias.php")}}]),angular.module("app").component("produtos",{templateUrl:"app/01-produtos/produtos.html",controller:["ProdutosService","AppService",function(t,o){var e=this;e.config=o.config,t.grupos().then(function(t){e.grupos=t.data}),t.categorias().then(function(t){e.categorias=t.data});var r,n;e.selectGrupo=function(t){e.currentGrupo=t,n&&n.removeClass("destaque"),n=$("#grupo_"+t.id),n.addClass("destaque"),r&&(r.removeClass("destaque"),delete e.currentCategoria),e.config.grupos[t.id]&&(r=$("#categoria_"+e.config.grupos[t.id]),r.addClass("destaque"),r.closest("ul").addClass("opened"))},e.selectCategoria=function(t){r&&r.removeClass("destaque"),e.currentCategoria=t,r=$("#categoria_"+t.id),r.addClass("destaque")},e.save=function(){e.config.grupos[e.currentGrupo.id]=e.currentCategoria.id,o.save().then(function(){n.removeClass("destaque"),r.removeClass("destaque"),delete e.currentGrupo,delete e.currentCategoria})}}]}).component("grupoList",{templateUrl:"grupo-list",bindings:{label:"@",grupos:"=",opened:"=",select:"="},controller:["AppService",function(t){this.config=t.config}]}),angular.module("app").service("AppService",["$http",function(t){var o=this;o.config={},t.get("/api/config.json").then(function(t){angular.extend(o.config,t.data)}),o.save=function(){return t.post("/api/config.php",o.config).then(function(t){angular.extend(o.config,t.data)})}}]),angular.module("app").component("app",{templateUrl:"app/hello.html",controller:["AppService",function(t){this.config=t.config}]}),angular.module("app").run(["$templateCache",function(t){t.put("app/hello.html",'<div>\n  <button type="button" class="btn btn-default" ui-sref="app.produtos" ui-sref-active="btn-primary">Configuração de categorias</button>\n  \x3c!-- <button type="button" class="btn btn-default" ui-sref="app.produtos2" ui-sref-active="btn-primary">Importar produtos</button> --\x3e\n  <button type="button" class="btn btn-default" ui-sref="app.importacao" ui-sref-active="btn-primary">Importar produtos</button>\n  <button type="button" class="btn btn-default" ui-sref="app.estoque" ui-sref-active="btn-primary">Atualizar estoques</button>\n  <button type="button" class="btn btn-default" ui-sref="app.preco" ui-sref-active="btn-primary">Atualizar preços</button>\n</div>\n<ui-view></ui-view>\n'),t.put("app/01-produtos/produtos.html",'<header>\n  <div ng-if="$ctrl.currentGrupo && $ctrl.currentCategoria">\n    Associar <strong>{{$ctrl.currentGrupo.name}}</strong> à <strong>{{$ctrl.currentCategoria.name}}</strong>\n    <button class="btn" ng-click="$ctrl.save();">Salvar</button>\n  </div>\n  <h4 ng-if="!$ctrl.currentGrupo || !$ctrl.currentCategoria">\n    Selecione o Grupo e a categoria\n  </h4>\n</header>\n\n\x3c!-- <pre>{{$ctrl.config|json}}</pre> --\x3e\n\n<div class="row">\n  <div class="col-md-6">\n    <h2>Grupos do Sankhya</h2>\n    <grupo-list label="grupo" grupos="$ctrl.grupos" opened="true" select="$ctrl.selectGrupo"></grupo-list>\n  </div>\n  <div class="col-md-6">\n    <h2>Categorias da loja</h2>\n    <grupo-list label="categoria" grupos="$ctrl.categorias" opened="true" select="$ctrl.selectCategoria"></grupo-list>\n  </div>\n</div>\n\n<script type="text/ng-template" id="grupo-list">\n  <ul ng-class="{opened: $ctrl.opened}">\n    <li id="{{$ctrl.label}}_{{grupo.id}}" ng-repeat="grupo in $ctrl.grupos" ng-class="{opened: grupo.opened}">\n      <label ng-if="!grupo.children.length" ng-click="$ctrl.select(grupo)">{{grupo.name}}\n        <span ng-if="$ctrl.config.grupos[grupo.id]">({{$ctrl.config.grupos[grupo.id]}})</span>\n      </label>\n      <span ng-if="grupo.children.length" class="has-children">\n        <label ng-click="grupo.opened=!grupo.opened;">{{grupo.name}}</label>\n        <grupo-list label="{{$ctrl.label}}" grupos="grupo.children" opened="grupo.opened" select="$ctrl.select"></grupo-list>\n      </span>\n    </li>\n  </ul>\n<\/script>\n'),t.put("app/02-importacao/importacao.html",'<button type="button" class="btn btn-default" ng-disabled-="true" ng-click="$ctrl.categorias()">Rodar importação</button>\r\n<span ng-if="$ctrl.loading">Carregando</span>\r\n\r\n<div ng-repeat="produto in $ctrl.log">\r\n  <hr>\r\n  <p><label>Produto:</label> {{produto.name}}</p>\r\n  <p><label>Grupo:</label> {{produto.group}}</p>\r\n  <p><label>Situação:</label> {{!produto.status?\'Produto já cadastrado\':\'Produto cadastrado com sucesso\'}}</p>\r\n</div>\r\n'),t.put("app/03-estoque/estoque.html",'<button type="button" class="btn btn-default" ng-disabled-="true" ng-click="$ctrl.estoque()">Rodar importação</button>\r\n<span ng-if="$ctrl.loading">Carregando</span>\r\n\r\n<div ng-repeat="produto in $ctrl.log">\r\n  <hr>\r\n  <p><label>Produto:</label> {{produto.name}}</p>\r\n  <p><label>Valor atual:</label> {{produto.current}}</p>\r\n  <p><label>Novo valor:</label> {{produto.new}}</p>\r\n</div>\r\n'),t.put("app/04-preco/preco.html",'<button type="button" class="btn btn-default" ng-disabled-="true" ng-click="$ctrl.preco()">Rodar importação</button>\r\n<span ng-if="$ctrl.loading">Carregando</span>\r\n\r\n<div ng-repeat="produto in $ctrl.log">\r\n  <hr>\r\n  <p><label>Produto:</label> {{produto.name}}</p>\r\n  <p><label>Valor atual:</label> {{produto.current}}</p>\r\n  <p><label>Novo valor:</label> {{produto.new}}</p>\r\n</div>\r\n')}]),angular.module("app").config(routesConfig);
//# sourceMappingURL=../maps/scripts/app-a27c5a89cf.js.map
