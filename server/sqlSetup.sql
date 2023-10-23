create DATABASE mayfly

create TABLE services (
  id serial PRIMARY KEY,
  name varchar(255),
  container_registry_address text,
  created_at TIMESTAMP DEFAULT now()
)

create TABLE backends (
  id serial PRIMARY KEY,
  plane_id text,
  service_id int,
  launch_success boolean,
  created_at TIMESTAMP DEFAULT now(),
  terminated_at TIMESTAMP,
  CONSTRAINT service_id 
     FOREIGN KEY(service_id)
        REFERENCES services(service_id)
)

INSERT INTO services VALUES ('drop four', "ghcr.io/drifting-in-space/demo-image-drop-four:latest");