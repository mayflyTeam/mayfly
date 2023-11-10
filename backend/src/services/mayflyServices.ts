import pgPromise from 'pg-promise'
const pgp = pgPromise();
const cn = 'postgres://mayfly:mayfly@localhost:5432/mayfly'
const db = pgp(cn);

interface Service {
  id: number;
  name: string;
}

interface Backend {
  id: number,
  url: string;
  launch_success: boolean;
  created_at: Date;
  terminated_at: Date;
}

interface HatchResponse {
  url: string | null;
  error: string | null;
}

type GetAllServicesType = (userId: number) => Promise<Service[]>;

export const getAllServicesByUser: GetAllServicesType = (userId: number) => {
  return db.many<Service>('SELECT id, name FROM services WHERE user_id = $1', userId)
    .then(services => {
      return services;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};

export const getServiceId = async (service: string): Promise<number> => {
  const response = await db.one<Service>('SELECT id FROM services WHERE name = $1', [service]);
  return response.id;
}

interface BackendResponse {
  url: string,
  launchSuccess: boolean,
  hatchedAt: Date,
  squishedAt: Date
}

export const getConvertedBackends = async (user: string, serviceId: number): Promise<BackendResponse[]> => {
  const backends = await db.many<Backend>('SELECT url, launch_success, created_at, terminated_at FROM backends AS b JOIN users_backends AS ub ON b.id = ub.backend_id WHERE ub.user_id = $1 AND b.service_id = $2 ORDER BY b.created_at DESC', [user, serviceId])
  const convertedBackends = backends.map(backend => {
    return {
      url: backend.url,
      launchSuccess: backend.launch_success,
      hatchedAt: backend.created_at,
      squishedAt: backend.terminated_at
    };
  });
  return convertedBackends;
}


export const insertIntoServices = async (serviceName: string, image: string, userId: number) => {
  const query = 'INSERT INTO services (name, image, user_id) VALUES (${name}, ${image}, ${user_id})';

  try {
    await db.none(query, {
      name: serviceName,
      image: image,
      user_id: userId,
    });

    return 'Insertion successful';
  } catch (error) {
    console.error('Error inserting into services:', error);
    throw error;
  }
}

export const insertIntoBackends = async (url: string | null, success: boolean, serviceId: number) => {
  try {
    const response = await db.one<Backend>(
      `INSERT INTO backends (url, launch_success, service_id) VALUES ($1, $2, $3) 
       RETURNING *`,
      [url, success, serviceId]
    );
    return response;
  } catch (error) {
    // Handle the error, e.g., log it or throw a custom error.
    console.error('Error inserting into backends:', error);
    throw new Error('Failed to insert into backends');
  }
};

export const insertIntoUserBackends = async (userId: number, backendId: number) => {
  try {
    const response = await db.none(
      'INSERT INTO users_backends (user_id, backend_id) VALUES ($1, $2)',
      [userId, backendId]
    );
    return response;
  } catch (error) {
    // Handle the error, e.g., log it or throw a custom error.
    console.error('Error inserting into user backends:', error);
    throw new Error('Failed to insert into user backends');
  }
};


// export const insertIntoServices = async (serviceName: string, image: string, userId: number) => {
//   const response = await db.none(`INSERT INTO services (name, image, user_id) VALUES ($1, $2, $3)`, [serviceName, image, userId])
//   return response;
// }

// export const insertIntoBackends = async (url: string | null, success: boolean, serviceId: number) => {
//   const response = await db.one<Backend>(`INSERT INTO backends (url, launch_success, service_id) VALUES ($1, $2, $3) 
//                                          RETURNING *`, [url, success, serviceId])
//   return response;
// }

// export const insertIntoUserBackends = async (userId: number, backendId: number) => {
//   const response = await db.none('INSERT INTO users_backends (user_id, backend_id) VALUES ($1, $2)', [userId, backendId])
//   return response;
// }
