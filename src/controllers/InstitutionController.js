import { Institution } from "../models/Institution";

async function create(req, res) {
  try {
    const {
      name,
      manager,
      avatar,
      information,
      address,
      dailyEvents,
      religion,
    } = req.body;

    const institution = await Institution.create({
      name,
      manager,
      avatar,
      address,
      information,
      dailyEvents,
      religion,
    });

    return res.status(201).json(institution);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function update(req, res) {
  try {
    const institution = await Institution.findById(req.params.id);

    if (!institution) {
      return res.status(404).json({
        message: "Instituição não encontrada",
      });
    }

    const institutionUpdated = await Institution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json(institutionUpdated);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function remove(req, res) {
  try {
    const institution = await Institution.findByIdAndRemove(req.params.id);

    if (!institution) {
      return res.status(404).json({ message: "Instituição não encontrada." });
    }

    return res
      .status(200)
      .json({ message: "Instituição deletada com sucesso" });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
}

async function getAll(req, res) {
  try {
    const name = req.query.name;
    const religion = req.query.religion;
    const sort = req.query.sort;
    const lat = parseFloat(req.query.lat);
    const long = parseFloat(req.query.long);

    const query = {};
    if (name) {
      query.name = { $regex: `${name}.*`, $options: "i" };
    }
    if (religion) {
      query.religion = religion;
    }

    const results = query
      ? await Institution.find(query)
      : await Institution.find();

    // Calculate distances and add them to the results
    const resultsWithDistance = results.map((institution) => {
      const distance = calculateDistance(
        lat,
        long,
        institution.address.lat,
        institution.address.long
      );
      return { ...institution.toObject(), distance };
    });

    // Sort the results based on distance or name
    const sortedResults = resultsWithDistance.sort((a, b) => {
      if (sort === "1") {
        return a.name.localeCompare(b.name);
      } else {
        return a.distance - b.distance;
      }
    });

    // Paginação
    const page = parseInt(req.query.page) || 0;

    const pageLimit = parseInt(req.query.limit) || 5;

    const startIndex = page * pageLimit;

    const endIndex = (page + 1) * pageLimit;

    const paginatedResults = sortedResults.slice(startIndex, endIndex);

    var totalItens = sortedResults.length;

    const totalPages = Math.ceil(totalItens / pageLimit);

    return res.status(200).json({ paginatedResults, totalPages, totalItens });
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

async function getById(req, res) {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }

    return res.status(200).json(institution);
  } catch ({ message }) {
    return res.status(500).json({ message });
  }
}

export default {
  create,
  update,
  remove,
  getAll,
  getById,
};
