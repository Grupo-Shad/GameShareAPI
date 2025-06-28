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
}

export default FavoritesDao;