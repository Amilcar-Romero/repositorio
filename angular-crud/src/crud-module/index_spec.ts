// Importación de módulos y clases necesarios para las pruebas.
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { HostTree } from '@angular-devkit/schematics';

// Definición de un modelo JSON utilizado en las pruebas.
const model: any = {
  "title": "Hotel",
  "entity": "hotel",
  "api": {
    "url": "http://www.angular.at/api/hotel"
  },
  "filter": [
    "city"
  ],
  "fields": [
    // Definición de campos del modelo de datos "hotel."
  ]
};

// Descripción general de las pruebas.
describe('Angular CRUD Schematics', () => {
  // Creación de un corredor de pruebas (runner) para ejecutar los esquemas.
  const schematicRunner = new SchematicTestRunner(
    'schematics',
    path.join(__dirname, './../collection.json')
  );

  // Opciones predeterminadas para la generación del módulo CRUD.
  const defaultOptions: any = {
    name: 'hotel'
  };

  let appTree: UnitTestTree;

  // Opciones de configuración para el espacio de trabajo de Angular.
  const workspaceOptions: any = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '0.5.0',
  };

  // Opciones de configuración para una aplicación Angular.
  const appOptions: any = {
    name: 'crudtest',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'css',
    skipTests: false,
  };

  beforeEach(async () => {
    // Creación de un árbol de prueba con el modelo JSON.
    const tree = new UnitTestTree(new HostTree);
    // Agregar el archivo de modelo JSON al árbol de prueba.
    tree.create('/projects/crudtest/src/app/hotel/model.json', JSON.stringify(model));
    
    // Configuración del espacio de trabajo y la aplicación Angular en el árbol de prueba.
    appTree = await schematicRunner.runExternalSchematic('@schematics/angular', 'workspace', workspaceOptions, tree);
    appTree = await schematicRunner.runExternalSchematic('@schematics/angular', 'application', appOptions, appTree);
  });

  // Prueba para verificar que se generen los archivos del componente "hotel-list".
  it('should create hotel-list component files', (done) => {
    const files = ['hotel-list.component.html', 'hotel-list.component.spec.ts', 'hotel-list.component.ts'];
    const hotelListPath = '/projects/crudtest/src/app/hotel/hotel-list/';
    
    schematicRunner.runSchematic('crud-module', defaultOptions, appTree).then(tree => {
      files.forEach(f => {
        const path = `${hotelListPath}${f}`;
        expect(tree.exists(path)).toEqual(true);
      });
      done();
    }, done.fail);
  });

  // Prueba para verificar que se utilice Bootstrap por defecto en las plantillas generadas.
  it('should use Bootstrap by default', (done) => {
    const hotelListPath = '/projects/crudtest/src/app/hotel/hotel-list/hotel-list.component.html';
    
    schematicRunner.runSchematic('crud-module', defaultOptions, appTree).then(tree => {
      const listTemplate = tree.readContent(hotelListPath);
      expect(listTemplate).toContain(`class="table table-centered table-hover mb-0"`);
      expect(listTemplate).toContain(`class="btn btn-primary"`);
      done();
    }, done.fail);
  });

  // Prueba para verificar que se generen los archivos del componente "hotel-edit".
  it('should create hotel-edit component files', (done) => {
    const files = ['hotel-edit.component.html', 'hotel-edit.component.spec.ts', 'hotel-edit.component.ts'];
    const hotelListPath = '/projects/crudtest/src/app/hotel/hotel-edit/';
    
    schematicRunner.runSchematic('crud-module', defaultOptions, appTree).then(tree => {
      files.forEach(f => {
        const path = `${hotelListPath}${f}`;
        expect(tree.exists(path)).toEqual(true);
      });
      done();
    }, done.fail);
  });

  // Prueba para verificar que se agreguen rutas al archivo de enrutamiento.
  it('should add routes', (done) => {
    schematicRunner.runSchematic('crud-module', defaultOptions, appTree).then(tree => {
      const routingModule = tree.readContent('/projects/crudtest/src/app/hotel/hotel.routes.ts');
      expect(routingModule).toContain(`path: 'hotels'`);
      expect(routingModule).toContain(`path: 'hotels/:id'`);
      done();
    }, done.fail);
  });

  // Prueba para verificar que se importe el módulo del componente en el archivo de módulo de la aplicación.
  it('should import the module in the app module file', (done) => {
    schematicRunner.runSchematic('crud-module', defaultOptions, appTree).then(tree => {
      const appModule = tree.readContent('/projects/crudtest/src/app/app.module.ts');
      expect(appModule).toMatch(/.\/hotel\/hotel.module/);
      expect(appModule).toMatch(/HotelModule/);
      done();
    }, done.fail);
  });

  // Prueba para verificar la generación de plantillas con Bootstrap.
  it('should generate Bootstrap templates', (done) => {
    const bootstrapOptions = { ...defaultOptions };
    bootstrapOptions.style = 'bootstrap';
    
    schematicRunner.runSchematic('crud-module', bootstrapOptions, appTree).then(tree => {
      const hotelList = tree.readContent('/projects/crudtest/src/app/hotel/hotel-list/hotel-list.component.html');
      expect(hotelList).toMatch(/<table class="table/);

      const hotelEdit = tree.readContent('/projects/crudtest/src/app/hotel/hotel-edit/hotel-edit.component.html');
      expect(hotelEdit).toMatch(/class="form-control"/);
      done();
    }, done.fail);
  });

  // Prueba para verificar la generación de plantillas con Angular Material.
  it('should generate Angular Material templates', (done) => {
    const materialOptions = { ...defaultOptions };
    materialOptions.style = 'material';
    
    schematicRunner.runSchematic('crud-module', materialOptions, appTree).then(tree => {
      const hotelList = tree.readContent('/projects/crudtest/src/app/hotel/hotel-list/hotel-list.component.html');
      expect(hotelList).toMatch(/<table mat-table/);

      const hotelEdit = tree.readContent('/projects/crudtest/src/app/hotel/hotel-edit/hotel-edit.component.html');
      expect(hotelEdit).toMatch(/matInput/);
      done();
    }, done.fail);
  });
});
