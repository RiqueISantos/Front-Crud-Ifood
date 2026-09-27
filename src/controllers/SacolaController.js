/**
 * SacolaController — Singleton
 *
 * Gerencia a sacola globalmente. É instanciado uma vez no main.js
 * e compartilhado com RestauranteClienteController via window._sacola.
 *
 * Responsabilidades:
 *  - Carregar sacola do backend na inicialização
 *  - Adicionar / atualizar / remover itens
 *  - Manter badge do carrinho na home atualizado
 *  - Abrir/fechar o drawer
 */

import {
  apiVerSacola,
  apiAdicionarItemSacola,
  apiAtualizarItemSacola,
  apiRemoverItemSacola,
  apiLimparSacola,
  getToken,
} from '../services/api.js'

export class SacolaController {
  constructor(view) {
    this._view   = view
    this._sacola = null
  }

  async init() {
    this._view.mount()
    this._bindEventos()
    if (getToken()) await this._carregar()
  }

  // ── Abrir / fechar ────────────────────────────────────────────────────────

  abrir() {
    this._view.open()
  }

  fechar() {
    this._view.close()
  }

  toggle() {
    this._view.isOpen() ? this.fechar() : this.abrir()
  }

  // ── Quantidade total de itens ─────────────────────────────────────────────

  totalItens() {
    if (!this._sacola?.itens?.length) return 0
    return this._sacola.itens.reduce((s, i) => s + i.quantidade, 0)
  }

  // ── Verificar conflito de restaurante ─────────────────────────────────────

  temConflito(restauranteId) {
    if (!this._sacola?.restaurante) return false
    return this._sacola.restaurante.id !== restauranteId
  }

  nomeRestauranteAtual() {
    return this._sacola?.restaurante?.nome ?? ''
  }

  // ── Adicionar item ────────────────────────────────────────────────────────

  async adicionarItem(produtoId, substituir = false, observacao = '') {
    if (!getToken()) {
      this._view.showToast('Faça login para adicionar itens.', 'error')
      return false
    }
    try {
      const result = await apiAdicionarItemSacola({
        produto_id: produtoId,
        quantidade: 1,
        substituir_sacola: substituir,
        observacao: observacao || undefined,
      })

      // Conflito de restaurante — retorna objeto com conflito:true
      if (result?.conflito) return { conflito: true, mensagem: result.mensagem }

      this._sacola = result
      this._atualizar()
      this._view.showToast('Item adicionado à sacola!', 'success')
      return true
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao adicionar item.', 'error')
      return false
    }
  }

  // ── Atualizar quantidade ──────────────────────────────────────────────────

  async atualizarQtd(itemId, novaQtd) {
    this._view.setItemLoading(itemId, true)
    try {
      if (novaQtd <= 0) {
        const result = await apiRemoverItemSacola(itemId)
        this._sacola = typeof result === 'object' && result?.itens !== undefined ? result : null
      } else {
        this._sacola = await apiAtualizarItemSacola(itemId, novaQtd)
      }
      this._atualizar()
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao atualizar sacola.', 'error')
    } finally {
      this._view.setItemLoading(itemId, false)
    }
  }

  // ── Limpar sacola ─────────────────────────────────────────────────────────

  async limpar() {
    try {
      await apiLimparSacola()
      this._sacola = null
      this._atualizar()
      this._view.showToast('Sacola limpa.', 'default')
    } catch (err) {
      this._view.showToast(err.message || 'Erro ao limpar sacola.', 'error')
    }
  }

  // ── Carregar do backend ───────────────────────────────────────────────────

  async _carregar() {
    try {
      this._sacola = await apiVerSacola()
      this._atualizar()
    } catch { /* sacola vazia ou não autenticado */ }
  }

  // ── Atualizar view + badge ────────────────────────────────────────────────

  _atualizar() {
    this._view.renderSacola(this._sacola)
    const total = this.totalItens()
    this._view.atualizarBadge(total)
    // Atualiza badge da home também
    const cartBadge = document.getElementById('cart-badge')
    if (cartBadge) cartBadge.textContent = total
    // Re-bind dos botões de quantidade após re-render
    this._view.bindItens(
      (id, qty) => this.atualizarQtd(id, qty),
      (id, qty) => this.atualizarQtd(id, qty)
    )
  }

  // ── Bind eventos globais ──────────────────────────────────────────────────

  _bindEventos() {
    this._view.onFechar(   () => this.fechar())
    this._view.onLimpar(   () => this.limpar())
    this._view.onFinalizar(() => {
      this._view.showToast('Funcionalidade de pedido em breve!', 'default')
    })
  }
}
