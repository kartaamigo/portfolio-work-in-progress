(() => {
  const form = document.getElementById('contact-form');
  const button = form.querySelector('button[type=submit]');
  const status = document.getElementById('form-status');
  let sending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return;
    sending = true;
    button.disabled = true;
    button.textContent = 'Отправляю...';
    status.dataset.state = 'pending';
    status.textContent = 'Отправка сообщения...';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(data),
        signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || ![true, 'true'].includes(result.success)) throw new Error('Submission failed');
      status.dataset.state = 'success';
      status.textContent = 'Сообщение отправлено. Спасибо!';
      form.reset();
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Не удалось отправить сообщение. Попробуйте ещё раз или напишите через почту, Telegram или WhatsApp.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.textContent = 'Отправить сообщение';
    }
  });
})();
