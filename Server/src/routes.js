const playwright = require("playwright");

const express = require('express');

const routes = express.Router();

routes.post("/login", async (req, res) => {
  const { login, senha} = req.body;

  const browser = await playwright.chromium.launch(); // headless: false
  const context = await browser.newContext();
  const page = await context.newPage();


  try {
    // The actual interesting bit
    await page.goto(
      "https://stm.semfaz.saoluis.ma.gov.br/sistematributario/jsp/login/login.jsf"
    )
    //Digita login
    await page.locator('input[name="frmLogin\\:txtLogin"]').click();
    await page.locator('input[name="frmLogin\\:txtLogin"]').focus();
    await page.keyboard.insertText(login);

    //Digita senha
    await page.locator('input[name="frmLogin\\:j_id8"]').click();
    await page.locator('input[name="frmLogin\\:j_id8"]').focus();
    await page.keyboard.insertText(senha);

    await page.locator("text=Entrar").click();

    //aguarda página carregar
    await page.waitForURL(
      "https://stm.semfaz.saoluis.ma.gov.br/sistematributario/jsp/login/bemVindo.jsf",
      {timeout: 5000} //tempo max de espera
    )

    await browser.close();
    //retorna OK
    return res.status(201).send();
  } catch(err){
    await browser.close();
    return res.status(500).send("CNPJ ou senha inválidos! Aguarde 3 minutos e tente novamente")
  }
});


routes.post("/emitirNota", async (req, res) => {
  const { login, senha, email, cnpj, descricao, quantidade, valor } = req.body;
  const browser = await playwright.chromium.launch(); // headless: false
  const context = await browser.newContext();
  const page = await context.newPage();

  try {

    // Carrega a primeira página
    await page.goto(
      "https://stm.semfaz.saoluis.ma.gov.br/sistematributario/jsp/login/login.jsf"
    )
    //Digita login
    await page.locator('input[name="frmLogin\\:txtLogin"]').click();
    await page.locator('input[name="frmLogin\\:txtLogin"]').focus();
    await page.keyboard.insertText(login);

    //Digita senha
    await page.locator('input[name="frmLogin\\:j_id8"]').click();
    await page.locator('input[name="frmLogin\\:j_id8"]').focus();
    await page.keyboard.insertText(senha);

    await page.locator("text=Entrar").click();

    //aguarda página carregar
    await page.waitForURL(
      "https://stm.semfaz.saoluis.ma.gov.br/sistematributario/jsp/login/bemVindo.jsf"
    )
    //Acessa para a página de emissão
    await page.locator('a[id="j_id4:j_id27:3:j_id30"]').focus();
    await page.keyboard.down("Enter");
    
    //Digita e pesquisa o cnpj
    await page.locator('input[id="form1:cpfCnpjTomador"]').focus();
    await page.keyboard.insertText(cnpj);
    await page.locator('a[id="form1:j_id258"]').focus();
    await page.keyboard.down("Enter");

    //Aguarda o o cnpj ser consultado
    while ((await page.locator('input[id="form1:razaoSocialTomador"]').allTextContents) != [ "" ]) {
      await page.locator('a[id="form1:j_id313"]').click();
      break;
    }
    //seleciona atividade do prestador
    while (await page.locator('select[id="form1:cmbTributacao"]').isDisabled()) {
      await page.locator('select[id="form1:cmbAtividades"]').click();
      await page.keyboard.down("ArrowDown");
      await page.keyboard.down("Enter");
      break;
    }

    //seleciona tipo de recolhimento
    while (await page.locator('select[id="form1:cmbRecolhimento"]').isDisabled) {
      await page.locator('select[id="form1:cmbTributacao"]').click();
      await page.keyboard.down("ArrowDown");
      await page.keyboard.down("Enter");
      break;
    }

    while (await page.locator('input[id="form1:aliquotaIss"]').isDisabled) {
      await page.locator('select[id="form1:cmbRecolhimento"]').click();
      await page.keyboard.down("ArrowDown");
      await page.keyboard.down("Enter");
      break;
    }

    await page.locator('a[id="form1:j_id433"]').click();

    await page.locator('input[id="form1:descricaoItem"]').click();
    await page.locator('input[id="form1:descricaoItem"]').fill(descricao);

    await page.locator('input[id="form1:quantidadeItem"]').click();
    await page.locator('input[id="form1:quantidadeItem"]').fill(quantidade);

    await page.locator('input[id="form1:valorUnitarioItem"]').click();
    await page.locator('input[id="form1:valorUnitarioItem"]').fill(valor);

    while ((page.locator('input[id="form1:quantidadeItem"]').allTextContents) != [ "" ]){
      await page.locator('a[id="form1:j_id604"]').click();
      break;
    }
    await page.locator('a[id="form1:j_id685"]').click();

    while (await page.locator('a[id="j_id774:j_id796"]').isVisible){
      await page.locator('a[id="j_id774:j_id796"]').click();
      break;
    }

    await page.locator('a[id="form1:j_id23"]').click();
    //envia email
    while (page.locator('input[id="j_id26:emailPara"]').isVisible){
      await page.locator('input[id="j_id26:emailPara"]').click();
      await page.locator('input[id="j_id26:emailPara"]').fill(email);
      await page.locator('a[id="j_id26:j_id43"]').click();
      break;
    }

    //verifica se a caixa de envio do email foi fechada
    while (!page.locator('a[id="j_id26:j_id43"]').isVisible) {
      await browser.close();
      break;
    }
    //retorna OK
    return res.status(201).send();
  } catch(err){
    await browser.close();
    return res.status(500).send("Erro no sistema! Aguarde 3 minutos e tente novamente")
  }
});

module.exports = routes;