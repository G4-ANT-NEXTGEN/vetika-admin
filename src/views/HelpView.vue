<template>
    <div class="help">
        <header class="page-header help-header">
            <div class="header-content">
                <div class="eyebrow-wrapper">
                    <div class="icon-circle">
                        <i class="bi bi-question-circle-fill"></i>
                    </div>
                    <p class="eyebrow">Help & Support</p>
                </div>
                <h1 class="header-title">How can we help?</h1>
                <p class="subtext">Find answers fast or reach out to the support team.</p>
            </div>

            <div class="header-actions">
                <RouterLink to="/" class="btn accent">
                    <i class="bi bi-house-fill"></i>
                    Back to Dashboard
                </RouterLink>
            </div>
        </header>

        <section class="cards-grid">
            <article class="card info-card">
                <div class="card-icon">
                    <i class="bi bi-rocket-takeoff-fill"></i>
                </div>
                <div>
                    <h3>Getting started</h3>
                    <p>Learn the basics of navigating the admin, managing users, and creating content.</p>
                </div>
            </article>
            <article class="card info-card">
                <div class="card-icon">
                    <i class="bi bi-shield-lock-fill"></i>
                </div>
                <div>
                    <h3>Security & roles</h3>
                    <p>Understand role access, admin permissions, and how we keep your data safe.</p>
                </div>
            </article>
            <article class="card info-card">
                <div class="card-icon">
                    <i class="bi bi-bar-chart-fill"></i>
                </div>
                <div>
                    <h3>Reporting</h3>
                    <p>Generate reports from the dashboard and export metrics for your team.</p>
                </div>
            </article>
        </section>

        <section class="card help-grid">
            <div class="help-column">
                <div class="section-head">
                    <div class="section-title">
                        <i class="bi bi-lightbulb-fill" aria-hidden="true"></i>
                        <span>Popular questions</span>
                    </div>
                    <span class="muted">Updated weekly</span>
                </div>
                <ul class="faq-list">
                    <li>
                        <h4>How do I add a new category?</h4>
                        <p>Open Categories, select Create, and fill out the required details.</p>
                    </li>
                    <li>
                        <h4>Why can’t a user log in?</h4>
                        <p>Check the user role and verification status from the Users module.</p>
                    </li>
                    <li>
                        <h4>How do I reset a user profile?</h4>
                        <p>Visit the User page, open the profile, and choose Reset from actions.</p>
                    </li>
                </ul>
            </div>

            <div class="help-column">
                <div class="section-head">
                    <div class="section-title">
                        <i class="bi bi-headset" aria-hidden="true"></i>
                        <span>Support channels</span>
                    </div>
                    <span class="muted">We respond within 24 hours</span>
                </div>
                <div class="support-list">
                    <div class="support-card">
                        <div class="support-icon">
                            <i class="bi bi-envelope-fill"></i>
                        </div>
                        <div>
                            <h4>Email support</h4>
                            <p>support@nextgen.local</p>
                        </div>
                    </div>
                    <div class="support-card">
                        <div class="support-icon">
                            <i class="bi bi-chat-dots-fill"></i>
                        </div>
                        <div>
                            <h4>Live chat</h4>
                            <p>Available 9 AM - 6 PM GMT</p>
                        </div>
                    </div>
                    <div class="support-card">
                        <div class="support-icon">
                            <i class="bi bi-journal-text"></i>
                        </div>
                        <div>
                            <h4>Knowledge base</h4>
                            <p>Browse step-by-step guides and best practices.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.help {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.help-header {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    background: var(--nav-bg);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    padding: 32px;
}

.header-content {
    min-width: 220px;
}

.eyebrow-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.icon-circle {
    width: 28px;
    height: 28px;
    background: var(--nav-surface);
    border-radius: 50%;
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text);
    font-size: 14px;
}

.eyebrow {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-muted);
}

.header-title {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    color: var(--color-text);
}

.subtext {
    margin: 8px 0 0;
    color: var(--color-muted);
    font-size: 15px;
}

.header-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
}

.btn.accent {
    background: var(--color-text);
    color: var(--nav-bg);
    border: none;
}

.btn.outline {
    background: var(--nav-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
}

.btn.outline:hover {
    background: var(--color-hover);
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
}

.card {
    background: var(--nav-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 16px;
}

.info-card {
    display: flex;
    gap: 12px;
    align-items: flex-start;
}

.info-card h3 {
    margin: 0 0 6px;
    font-size: 16px;
    color: var(--color-text);
}

.info-card p {
    margin: 0;
    color: var(--color-muted);
    font-size: 14px;
    line-height: 1.5;
}

.card-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: var(--color-accent);
    color: var(--color-text);
    display: grid;
    place-items: center;
    font-size: 18px;
}

.help-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
}

.help-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: var(--color-text);
}

.muted {
    color: var(--color-muted);
    font-size: 12px;
}

.faq-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 14px;
}

.faq-list h4 {
    margin: 0 0 6px;
    font-size: 14px;
    color: var(--color-text);
}

.faq-list p {
    margin: 0;
    font-size: 13px;
    color: var(--color-muted);
    line-height: 1.5;
}

.support-list {
    display: grid;
    gap: 12px;
}

.support-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid var(--color-border);
    background: var(--nav-bg);
}

.support-card h4 {
    margin: 0 0 4px;
    font-size: 14px;
    color: var(--color-text);
}

.support-card p {
    margin: 0;
    font-size: 13px;
    color: var(--color-muted);
}

.support-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--color-accent);
    color: var(--color-text);
    display: grid;
    place-items: center;
}

@media (max-width: 768px) {
    .help-header {
        padding: 24px;
    }

    .header-actions {
        width: 100%;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
