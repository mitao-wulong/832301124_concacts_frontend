// API基础URL
const API_BASE_URL = 'http://localhost:5000/api/contacts';

// DOM元素
const contactForm = document.getElementById('contact-form');
const contactIdInput = document.getElementById('contact-id');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const contactsList = document.getElementById('contacts-list');
const searchInput = document.getElementById('search-input');

// 所有联系人数据
let allContacts = [];

// 页面加载时获取联系人列表
document.addEventListener('DOMContentLoaded', () => {
    fetchContacts();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    // 表单提交事件
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // 取消按钮点击事件
    cancelBtn.addEventListener('click', resetForm);
    
    // 搜索输入事件
    searchInput.addEventListener('input', handleSearch);
}

// 获取所有联系人
async function fetchContacts() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        allContacts = await response.json();
        renderContacts(allContacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        contactsList.innerHTML = `<p class="empty-state">加载联系人失败，请稍后重试</p>`;
    }
}

// 渲染联系人列表
function renderContacts(contacts) {
    if (contacts.length === 0) {
        contactsList.innerHTML = `<p class="empty-state">暂无联系人，请添加新联系人</p>`;
        return;
    }
    
    contactsList.innerHTML = '';
    
    contacts.forEach(contact => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <h3>${contact.name}</h3>
            ${contact.phone ? `<div class="contact-info">电话: ${contact.phone}</div>` : ''}
            ${contact.email ? `<div class="contact-info">邮箱: ${contact.email}</div>` : ''}
            ${contact.address ? `<div class="contact-info">地址: ${contact.address}</div>` : ''}
            <div class="contact-actions">
                <button class="edit-btn" data-id="${contact.id}">编辑</button>
                <button class="delete-btn" data-id="${contact.id}">删除</button>
            </div>
        `;
        
        contactsList.appendChild(card);
    });
    
    // 添加编辑和删除按钮的事件监听器
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEdit);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

// 处理表单提交
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const contactId = contactIdInput.value;
    const contactData = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        address: addressInput.value.trim()
    };
    
    try {
        let response;
        
        if (contactId) {
            // 更新联系人
            response = await fetch(`${API_BASE_URL}/${contactId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });
        } else {
            // 创建新联系人
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });
        }
        
        if (!response.ok) {
            throw new Error(contactId ? '更新联系人失败' : '创建联系人失败');
        }
        
        // 重置表单并重新获取联系人列表
        resetForm();
        await fetchContacts();
        
    } catch (error) {
        console.error('Error saving contact:', error);
        alert(error.message);
    }
}

// 处理编辑按钮点击
async function handleEdit(e) {
    const contactId = parseInt(e.target.dataset.id);
    
    try {
        const response = await fetch(`${API_BASE_URL}/${contactId}`);
        if (!response.ok) {
            throw new Error('获取联系人详情失败');
        }
        
        const contact = await response.json();
        
        // 填充表单
        contactIdInput.value = contact.id;
        nameInput.value = contact.name;
        phoneInput.value = contact.phone || '';
        emailInput.value = contact.email || '';
        addressInput.value = contact.address || '';
        
        // 更新按钮文本和显示取消按钮
        submitBtn.textContent = '更新联系人';
        cancelBtn.style.display = 'inline-block';
        
        // 滚动到表单顶部
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error editing contact:', error);
        alert(error.message);
    }
}

// 处理删除按钮点击
async function handleDelete(e) {
    if (!confirm('确定要删除这个联系人吗？')) {
        return;
    }
    
    const contactId = parseInt(e.target.dataset.id);
    
    try {
        const response = await fetch(`${API_BASE_URL}/${contactId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('删除联系人失败');
        }
        
        // 重新获取联系人列表
        await fetchContacts();
        
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert(error.message);
    }
}

// 重置表单
function resetForm() {
    contactForm.reset();
    contactIdInput.value = '';
    submitBtn.textContent = '添加联系人';
    cancelBtn.style.display = 'none';
}

// 处理搜索
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    const filteredContacts = allContacts.filter(contact => {
        return (
            contact.name.toLowerCase().includes(searchTerm) ||
            (contact.phone && contact.phone.includes(searchTerm)) ||
            (contact.email && contact.email.toLowerCase().includes(searchTerm)) ||
            (contact.address && contact.address.toLowerCase().includes(searchTerm))
        );
    });
    
    renderContacts(filteredContacts);
}