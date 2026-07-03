import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const openModalBtn = document.getElementById('openModalBtn') as HTMLButtonElement;
  const closeModalBtn = document.getElementById('closeModalBtn') as HTMLButtonElement;
  const modalOverlay = document.getElementById('sellCarModal') as HTMLDivElement;
  const searchBtn = document.getElementById('searchEstimateBtn') as HTMLButtonElement;
  const carInput = document.getElementById('carNumberInput') as HTMLInputElement;
  const errorMsg = document.getElementById('errorMessage') as HTMLParagraphElement;
  const spinner = document.getElementById('loadingSpinner') as HTMLDivElement;

  openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('hidden');
    carInput.focus();
  });

  closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    errorMsg.classList.add('hidden');
    carInput.classList.remove('input-error');
    carInput.value = '';
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.add('hidden');
    }
  });

  searchBtn.addEventListener('click', async () => {
    const carNumber = carInput.value.trim();
    errorMsg.classList.add('hidden');
    carInput.classList.remove('input-error');

    // Trigger reflow to restart animation
    void carInput.offsetWidth;

    if (!carNumber) {
      errorMsg.textContent = '차량번호를 입력해주세요.';
      errorMsg.classList.remove('hidden');
      carInput.classList.add('input-error');
      return;
    }

    const specialChars = /[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]/;
    if (specialChars.test(carNumber) || carNumber.includes(' ')) {
      errorMsg.textContent = '차량번호 형식이 올바르지 않습니다.';
      errorMsg.classList.remove('hidden');
      carInput.classList.add('input-error');
      return;
    }

    spinner.classList.remove('hidden');
    searchBtn.disabled = true;

    try {
      const response = await fetch('/api/v1/vehicles/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carNumber })
      });

      if (response.status === 500) {
        throw new Error('Internal Server Error');
      }

      window.location.href = '/result.html';
    } catch (e) {
      errorMsg.textContent = '잠시 후 다시 시도해주세요';
      errorMsg.classList.remove('hidden');
    } finally {
      spinner.classList.add('hidden');
      searchBtn.disabled = false;
    }
  });
});
