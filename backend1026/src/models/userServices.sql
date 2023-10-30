

CREATE TABLE users (
id serial PRIMARY KEY,
name varchar(50)
);

CREATE TABLE services (
  id serial PRIMARY KEY,
  name varchar(50),
  image varchar(255),
  user_id int REFERENCES users (id)
);

CREATE TABLE backends (
  id serial PRIMARY KEY,
  url text,
  launch_success boolean NOT NULL,
  created_at timestamp DEFAULT now(),
  terminated_at timestamp,
  service_id int REFERENCES services (id)
);

INSERT INTO users (name) VALUES ('admin');

INSERT INTO services (name, image, user_id) 
VALUES 
('drop4', 'ghcr.io/drifting-in-space/demo-image-drop-four', 1),
('jupyter-notebook', 'ghcr.io/drifting-in-space/jamsocket-jupyter-notebook:sha-fa92787', 1),
('chess', 'docker address here', 1),
('checker', 'docker address here', 1);

INSERT INTO backends (url, launch_success, terminated_at, service_id)
VALUES
('http://localhost:4000/hey', true, now(), 1),
('http://localhost:4000/guy', false, NULL, 1),
('http://localhost:4000/barbe', true, now(), 4),
('http://localhost:4000/bliss', false, now(), 1),
('http://localhost:4000/teeth', true, now(), 2),
('http://localhost:4000/face', true, NULL, 2),
('http://localhost:4000/nose', false, now(), 3),
('http://localhost:4000/fro', true, NULL, 1),
('http://localhost:4000/ice', true, now(), 4),
('http://localhost:4000/fire', true, now(), 3);
