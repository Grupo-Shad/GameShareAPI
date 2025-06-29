import express from "express";
import FavoritesService from "../servicio/favorites.service.js";

class FavoritesController {
  #service;

  constructor(persistencia) {
    this.#service = new FavoritesService(persistencia);
  }

  getFavorites = async (req, res) => {
    try {
      const { userId } = req.params
      const favorites = await this.#service.getFavorites(userId)
      res.json(favorites)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  toggleFavorite = async (req, res) => {
    try {
      const { userId, gameId } = req.body
      const favorite = await this.#service.toggleFavorite(userId, gameId)
      res.json(favorite)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

}

export default FavoritesController; 