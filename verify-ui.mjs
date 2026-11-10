import {chromium} from 'playwright';
import {findChrome} from 'file:///C:/Users/mateo/.codex/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:findChrome(),headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:5178/');await page.locator('.product-card').first().waitFor();
 assert.equal(await page.locator('.product-card').count(),6);
 await page.getByRole('button',{name:'R$ BRL',exact:true}).click();assert.match(await page.locator('.price').first().innerText(),/BRL/);
 await page.locator('.filters').getByRole('button',{name:'Textiles',exact:true}).click();assert.equal(await page.locator('.product-card').count(),2);
 await page.getByRole('textbox',{name:'Buscar productos'}).fill('manta');assert.equal(await page.locator('.product-card').count(),1);
 await page.getByRole('button',{name:'Agregar Manta de algodón',exact:true}).click();await page.getByRole('button',{name:/Mi selección/}).click();
 const link=await page.getByRole('link',{name:'Consultar por WhatsApp'}).getAttribute('href');assert.match(link,/59898360204/);assert.match(decodeURIComponent(link),/BRL/);assert.match(decodeURIComponent(link),/Manta/);
 await page.getByRole('button',{name:'Cerrar',exact:true}).click();
 await page.goto('http://127.0.0.1:5178/#admin');await page.getByRole('button',{name:'Categorías',exact:true}).click();await page.getByRole('button',{name:'Crear categoría',exact:true}).click();await page.getByRole('textbox',{name:'Nombre',exact:true}).fill('Prueba');await page.getByRole('button',{name:'Guardar categoría'}).click();await page.getByText('Categoría guardada.').waitFor();
 await page.getByRole('button',{name:'Productos',exact:true}).click();await page.getByRole('button',{name:'Agregar producto'}).click();await page.getByRole('textbox',{name:'Nombre',exact:true}).fill('Prueba integración');await page.getByLabel('Categoría',{exact:true}).selectOption({label:'Prueba'});await page.getByLabel('Precio en pesos (UYU)').fill('100');await page.getByLabel('Precio en reales (BRL)').fill('15');await page.getByLabel('Agregar fotos').setInputFiles('public/images/bear.jpg');await page.getByRole('button',{name:'Guardar producto'}).click();await page.getByText('Producto guardado.').waitFor();
 await page.reload();await page.getByText('Prueba integración',{exact:true}).waitFor();
 const row=page.locator('.admin-row').filter({hasText:'Prueba integración'});await row.getByRole('button',{name:'Disponible',exact:true}).click();await page.getByText('Producto oculto del catálogo.').waitFor();
 await page.getByRole('link',{name:'Ver catálogo',exact:true}).click();await page.locator('.product-card').first().waitFor();assert.equal(await page.locator('.product-card').filter({hasText:'Prueba integración'}).count(),0);
 await page.goto('http://127.0.0.1:5178/#admin');await page.getByRole('button',{name:'Categorías',exact:true}).click();await page.locator('.category-row').filter({hasText:'Prueba'}).getByRole('button',{name:'Eliminar',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Eliminar',exact:true}).click();await page.getByRole('dialog').getByText('Mové o eliminá los productos de esta categoría primero.').waitFor();await page.getByRole('button',{name:'Cerrar',exact:true}).click();
 await page.getByRole('button',{name:'Productos',exact:true}).click();await page.locator('.admin-row').filter({hasText:'Prueba integración'}).getByRole('button',{name:'Editar',exact:true}).click();await page.getByLabel('Precio en pesos (UYU)').fill('150');await page.getByRole('button',{name:'Guardar producto'}).click();await page.getByText('Producto guardado.').waitFor();assert.match(await page.locator('.admin-row').filter({hasText:'Prueba integración'}).innerText(),/150/);
 await page.getByRole('button',{name:'Eliminar Prueba integración',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Eliminar',exact:true}).click();await page.getByText('Eliminado correctamente.').waitFor();
 await page.evaluate(()=>localStorage.clear());await page.reload();await fs.mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/admin-desktop.png',fullPage:true});
 for(const width of [768,390]){await page.setViewportSize({width,height:900});await page.screenshot({path:`test-results/admin-${width}.png`,fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 await page.goto('http://127.0.0.1:5178/');await page.getByRole('button',{name:'Ver Juego de cama suave',exact:true}).click();assert.equal(await page.getByRole('dialog').count(),1);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);assert.deepEqual(errors,[]);console.log('PASS: catálogo, filtros, moneda, selección WhatsApp, CRUD, fotos, persistencia demo, agotados ocultos, restricción categorías, modal teclado, admin responsive; sin errores JS.');
}finally{await browser.close();}

