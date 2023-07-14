import { Institution } from "../models/Institution";
import { User } from "../models/User";

async function addFavorites(req, res) {
  try {
    const { userId } = req;
    const { id } = req.params;

    // Checando se os usuários passados são válidos
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }

    if (institution.favorited.includes(userId)) {
      return res
        .status(400)
        .json({ message: `${institution.name} já está nos seus favoritos` });
    }

    const arrSubscribedFromFavorited = institution.favorited;
    arrSubscribedFromFavorited.push(userId);

    await institution.updateOne({
      favorited: arrSubscribedFromFavorited || institution.favorited,
    });

    return res
      .status(200)
      .json({ message: `${institution.name} adicionado(a) aos favoritos` });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function remFavorites(req, res) {
  try {
    const { userId } = req;
    const { id } = req.params;

    // Checando se os usuários passados são válidos
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }

    if (!institution.favorited.includes(userId)) {
      return res.status(400).json({
        message: `${institution.name} não pode ser removido(a) por não estar em sua lista de favoritos`,
      });
    }

    let arr = [];
    if (institution.favorited.length === 1) {
      institution.favorited = [];
    } else {
      arr = institution.favorited.filter((item) => !item.equals(userId));
    }

    await institution.updateOne({
      favorited: arr || institution.favorited,
    });

    return res
      .status(200)
      .json({ message: `${institution.name} removido(a) dos favoritos` });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

export default {
  addFavorites,
  remFavorites,
};
