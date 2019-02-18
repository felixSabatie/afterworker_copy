bash -c "echo "$MASTER_KEY" > config/master.key"
rails db:migrate RAILS_ENV=test
rspec