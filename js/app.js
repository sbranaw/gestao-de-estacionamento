// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cardsContainer');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // Modal elements
    const vehicleModal = document.getElementById('vehicleModal');
    const closeModalBtn = document.getElementById('closeModal');
    const btnNewRecord = document.getElementById('btnNewRecord');
    const vehicleForm = document.getElementById('vehicleForm');
    const modalTitle = document.getElementById('modalTitle');
    
    // Form buttons
    const btnEdit = document.getElementById('btnEdit');
    const btnDelete = document.getElementById('btnDelete');
    const btnCancelEdit = document.getElementById('btnCancelEdit');
    const btnSave = document.getElementById('btnSave');
    
    // Form inputs
    const formInputs = vehicleForm.querySelectorAll('input:not([type="hidden"]), select');
    const formVehicleId = document.getElementById('formVehicleId');
    const formName = document.getElementById('formName');
    const formUnit = document.getElementById('formUnit');
    const formPhone = document.getElementById('formPhone');
    const formPlate = document.getElementById('formPlate');
    const formModel = document.getElementById('formModel');
    const formType = document.getElementById('formType');
    const formSpotType = document.getElementById('formSpotType');
    const formAuthStatus = document.getElementById('formAuthStatus');

    let currentFilter = 'all';
    let searchQuery = '';
    let isEditMode = false;
    let isCreateMode = false;

    // Render Function
    function renderCards() {
        const vehicles = dataService.getVehicles();
        let filtered = vehicles.filter(v => {
            // Apply Search
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = v.name.toLowerCase().includes(searchLower) ||
                                  v.plate.toLowerCase().includes(searchLower) ||
                                  v.unit.toLowerCase().includes(searchLower);
            
            if (!matchesSearch) return false;

            // Apply Filters
            if (currentFilter === 'presentes') {
                return v.status === 'Presente';
            } else if (currentFilter === 'aguardando') {
                return v.status === 'Fora' && v.authStatus !== 'Não Autorizado';
            } else if (currentFilter === 'nao_autorizados') {
                return v.authStatus === 'Não Autorizado';
            } else if (currentFilter === 'vaga_fixa') {
                return v.spotType === 'Fixa';
            } else if (currentFilter === 'vaga_esporadica') {
                return v.spotType === 'Esporádica';
            } else if (currentFilter === 'vaga_visitante') {
                return v.spotType === 'Visitante';
            }
            return true;
        });

        cardsContainer.innerHTML = '';

        if (filtered.length === 0) {
            cardsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 3rem;">
                    <i class="ph ph-magnifying-glass" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Nenhum veículo encontrado.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(v => {
            // Determine visual status
            let uiStatus = 'aguardando';
            let uiStatusText = 'Aguardando';
            
            if (v.status === 'Presente') {
                uiStatus = 'presente';
                uiStatusText = 'No Pátio';
            } else if (v.authStatus === 'Não Autorizado') {
                uiStatus = 'negado';
                uiStatusText = 'Não Autorizado';
            }

            const card = document.createElement('div');
            card.className = `card status-${uiStatus}`;
            card.style.cursor = 'pointer'; // Indicador visual de clique
            
            card.innerHTML = `
                <div class="card-header">
                    <span class="plate-badge">${v.plate}</span>
                    <span class="status-badge">${uiStatusText}</span>
                </div>
                
                <div class="card-body">
                    <div class="info-row">
                        <i class="ph ph-user"></i>
                        <span>${v.name}</span>
                    </div>
                    <div class="info-row">
                        <i class="ph ph-house"></i>
                        <span>${v.unit}</span>
                    </div>
                    <div class="info-row">
                        <i class="ph ph-car"></i>
                        <span>${v.model} (${v.type})</span>
                    </div>
                    <div class="info-row">
                        <i class="ph ph-shield-check"></i>
                        <span>Vaga ${v.spotType} - ${v.authStatus}</span>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="time-info">
                        ${v.status === 'Presente' ? `<i class="ph ph-clock"></i> Entrada: <strong>${v.entryTime}</strong>` : ''}
                    </div>
                    ${generateActionButton(v)}
                </div>
            `;

            // Card click listener
            card.addEventListener('click', (e) => {
                // Prevent opening modal if clicking on the footer action buttons
                if(e.target.closest('.action-btn')) return;
                openModalForView(v);
            });

            cardsContainer.appendChild(card);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.action-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', handleActionClick);
        });
    }

    function generateActionButton(v) {
        if (v.authStatus === 'Não Autorizado') {
            return ``; // Sem botão de ação
        }
        
        if (v.status === 'Fora') {
            return `
                <button class="action-btn" data-id="${v.id}" data-action="enter">
                    <i class="ph ph-sign-in"></i> Liberar Entrada
                </button>
            `;
        } else {
            return `
                <button class="action-btn btn-outline" data-id="${v.id}" data-action="leave">
                    <i class="ph ph-sign-out"></i> Registrar Saída
                </button>
            `;
        }
    }

    function handleActionClick(e) {
        e.stopPropagation(); // Impede que o clique no botão abra o modal
        const btn = e.currentTarget;
        const id = parseInt(btn.getAttribute('data-id'));
        const action = btn.getAttribute('data-action');
        
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        if (action === 'enter') {
            dataService.updateVehicleStatus(id, 'Presente', timeString);
            showToast('Entrada liberada com sucesso!');
        } else {
            dataService.updateVehicleStatus(id, 'Fora', null);
            showToast('Saída registrada com sucesso!', '#f59e0b');
        }
        
        renderCards();
    }

    function showToast(message, color = 'var(--status-green)') {
        toastMessage.textContent = message;
        toast.style.background = color;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // --- Modal & CRUD Logic ---

    function openModalForView(vehicle) {
        isCreateMode = false;
        setFormState(false);
        
        modalTitle.textContent = 'Detalhes do Veículo';
        
        // Populate
        formVehicleId.value = vehicle.id;
        formName.value = vehicle.name;
        formUnit.value = vehicle.unit;
        formPhone.value = vehicle.phone;
        formPlate.value = vehicle.plate;
        formModel.value = vehicle.model;
        formType.value = vehicle.type;
        formSpotType.value = vehicle.spotType;
        formAuthStatus.value = vehicle.authStatus;

        btnEdit.classList.remove('hidden');
        btnDelete.classList.remove('hidden');
        btnCancelEdit.classList.add('hidden');
        btnSave.classList.add('hidden');

        vehicleModal.classList.remove('hidden');
    }

    function openModalForCreate() {
        isCreateMode = true;
        setFormState(true);
        vehicleForm.reset();
        formVehicleId.value = '';
        
        modalTitle.textContent = 'Novo Registro';
        
        btnEdit.classList.add('hidden');
        btnDelete.classList.add('hidden');
        btnCancelEdit.classList.add('hidden');
        btnSave.classList.remove('hidden');

        vehicleModal.classList.remove('hidden');
    }

    function setFormState(enabled) {
        isEditMode = enabled;
        formInputs.forEach(input => {
            input.disabled = !enabled;
        });
    }

    // Modal Events
    closeModalBtn.addEventListener('click', () => {
        vehicleModal.classList.add('hidden');
    });

    vehicleModal.addEventListener('click', (e) => {
        if(e.target === vehicleModal) vehicleModal.classList.add('hidden');
    });

    btnNewRecord.addEventListener('click', openModalForCreate);

    btnEdit.addEventListener('click', () => {
        setFormState(true);
        btnEdit.classList.add('hidden');
        btnDelete.classList.add('hidden');
        btnCancelEdit.classList.remove('hidden');
        btnSave.classList.remove('hidden');
    });

    btnCancelEdit.addEventListener('click', () => {
        // Restore previous data by fetching again
        const id = parseInt(formVehicleId.value);
        const vehicle = dataService.getVehicle(id);
        openModalForView(vehicle);
    });

    btnDelete.addEventListener('click', () => {
        const id = parseInt(formVehicleId.value);
        if(confirm('Tem certeza que deseja excluir este registro? Essa ação não pode ser desfeita.')) {
            dataService.deleteVehicle(id);
            vehicleModal.classList.add('hidden');
            showToast('Registro excluído com sucesso!', 'var(--status-red)');
            renderCards();
        }
    });

    vehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const vehicleData = {
            name: formName.value,
            unit: formUnit.value,
            phone: formPhone.value,
            plate: formPlate.value,
            model: formModel.value,
            type: formType.value,
            spotType: formSpotType.value,
            authStatus: formAuthStatus.value
        };

        if (isCreateMode) {
            dataService.addVehicle(vehicleData);
            showToast('Novo registro criado!');
        } else {
            const id = parseInt(formVehicleId.value);
            dataService.updateVehicleInfo(id, vehicleData);
            showToast('Registro atualizado com sucesso!');
        }

        vehicleModal.classList.add('hidden');
        renderCards();
    });

    // --- Search & Filters ---
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCards();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentFilter = e.target.getAttribute('data-filter');
            renderCards();
        });
    });

    // Initial render
    renderCards();
});
