export default async function handler(req, res) {
  // 1. Фильтруем типы запросов. VK шлет только POST. Если это GET проверка из браузера, даем статус 200.
  if (req.method !== 'POST') {
    return res.status(200).send('VK-to-GAS Proxy Hub is active. Waiting for VK POST requests.');
  }

  // 2. ВШИТЫЙ АКТУАЛЬНЫЙ URL ТВОЕГО GOOGLE WEB APP
  const GAS_URL = "https://script.google.com/macros/s/AKfycbzqEyMgsU6E3_IadsZb5tNgDFZVfWYNgwgUwXpYbXcIpqGDr5vzr7UKo5hLLqFWpegbjg/exec";

  try {
    // 3. Отправляем зеркальный запрос в Google Apps Script
    const gasResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      // КЛЮЧЕВОЙ ПАРАМЕТР: Движок сам переходит по 302 редиректу Google CDN, маскируя его от VK
      redirect: 'follow' 
    });

    // 4. Считываем чистый текстовый ответ от Google (код валидации или строка "ok")
    const responseText = await gasResponse.text();

    // 5. Отдаем результат серверу ВКонтакте с легитимным HTTP кодом 200 OK
    res.status(200).send(responseText);

  } catch (error) {
    console.error('Proxy Hub Critical Error:', error);
    res.status(500).send('Proxy Hub Internal Error');
  }
}