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
    const senderName = data.name.trim().replace(/[\r\n]+/g, ' ');
    const senderEmail = data.email.trim();
    const messageId = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
    data._subject = `Сообщение с сайта: ${senderName} (${senderEmail}) [${messageId}]`;
    data._replyto = senderEmail;
    sending = true;
    button.disabled = true;
    button.textContent = 'Отправляю...';
    status.dataset.state = 'pending';
    status.textContent = 'Отправка сообщения...';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(data),
        signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || ![true, 'true'].includes(result.success)) {
        const error = new Error('Submission failed');
        error.activation = /activat|confirm.*email|verify.*email|check.*email/i.test(result.message || '');
        throw error;
      }
      status.dataset.state = 'success';
      status.textContent = 'Сообщение отправлено. Спасибо!';
      form.reset();
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.activation
        ? 'Приём сообщений ещё не активирован. Пока напишите мне через почту, Telegram или WhatsApp.'
        : error.name === 'AbortError'
          ? 'Сервис отправки не ответил вовремя. Статус отправки неизвестен. Вы можете написать через почту, Telegram или WhatsApp.'
          : 'Не удалось подтвердить отправку. Вы можете написать через почту, Telegram или WhatsApp.';
      console.error('Contact form submission failed:', error);
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.textContent = 'Отправить сообщение';
    }
  });
})();
