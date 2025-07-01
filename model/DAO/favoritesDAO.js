class FavoritesDao {
    #favorites;

    constructor() {
        this.#favorites = [
            {
                userId: "1",
                favorites: [1, 3, 5]
            },
            {
                userId: "2", 
                favorites: [2, 4]
            },
            {
                userId: "3",
                favorites: [1, 2, 3, 4, 5]
            },
            {
                userId: "4",
                favorites: [3, 4]
            },
            {
                userId: "5",
                favorites: [1, 5]
            }
        ];
    }

    getFavorites = async (userId) => {
        const userFavorites = this.#favorites.find(f => f.userId === userId);
        return userFavorites ? userFavorites.favorites : [];
    }

    getFavoriteIds = async (userId) => {
        return await this.getFavorites(userId);
    }

    addFavorite = async (userId, gameId) => {
        const userFavorites = this.#favorites.find(f => f.userId === userId);
        if (userFavorites) {
            if (!userFavorites.favorites.includes(gameId)) {
                userFavorites.favorites.push(gameId);
            }
        } else {
            this.#favorites.push({
                userId: userId,
                favorites: [gameId]
            });
        }
        return userFavorites;
    }

    removeFavorite = async (userId, gameId) => {
        const userFavorites = this.#favorites.find(f => f.userId === userId);
        if (userFavorites) {
            userFavorites.favorites = userFavorites.favorites.filter(id => id !== gameId);
        }
        return userFavorites;
    }

}

export default FavoritesDao;