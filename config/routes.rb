Rails.application.routes.draw do
  namespace :api do
    post 'user_token' => 'user_token#create'
    resource :users, only: ['create']
  end

  root to: 'static_files#index'
  get '*path', to: 'static_files#index'
end
