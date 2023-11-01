

CREATE TABLE users(
  id serial PRIMARY KEY,
  username varchar(25) NOT NULL
);

CREATE TABLE services(
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  image text NOT NULL,
  user_id int REFERENCES users(id)
);

CREATE TABLE backends(
  id serial PRIMARY KEY,
  url text NOT NULL,
  launch_success boolean NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  terminated_at timestamp DEFAULT now(),
  service_id int REFERENCES services(id) 
);

CREATE TABLE users_backends(
  id serial PRIMARY KEY,
  user_id int REFERENCES users(id),
  backend_id int REFERENCES backends(id)
);

INSERT INTO users (username) VALUES ('admin');

INSERT INTO services (name, image, user_id) 
VALUES 
('drop4', 'ghcr.io/drifting-in-space/demo-image-drop-four', 1),
('jupyter-notebook', 'ghcr.io/drifting-in-space/jamsocket-jupyter-notebook:sha-fa92787', 1),
('checkers', 'ghcr.io/drifting-in-space/demo-image-drop-four', 1),
('chess', 'ghcr.io/drifting-in-space/demo-image-drop-four', 1);

INSERT INTO backends (url, launch_success, created_at, service_id)
VALUES
('http://f7643bec-47cd-4926-be2d-7203d4928716.taishan.website:8080/', true, now(), 1),
('http://f7643bec-47cd-4927-be2d-7203d4928716.taishan.website:8080/', true, now(), 1),
('http://f7643bec-47cd-4928-be2d-7203d4928716.taishan.website:8080/', true, now(), 1),
('http://f7643bec-47cd-4929-be2d-7203d4928716.taishan.website:8080/', true, now(), 2),
('http://f7643bec-47cd-4925-be2d-7203d4928716.taishan.website:8080/', true, now(), 2),
('', false, now(), 3),
('http://f7643bec-47cd-49210-be2d-7203d4928716.taishan.website:8080/', true, now(), 3);

INSERT INTO users_backends (user_id, backend_id)
VALUES (1,1), (1,2), (1,3), (1,4), (1,5), (1,6), (1,7); 