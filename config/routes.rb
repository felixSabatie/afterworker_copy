Rails.application.routes.draw do
  namespace :api do
    post 'user_token' => 'user_token#create'
    get '/users/current' => 'users#current'
    resources :users, only: [:create, :show]

    resources :events, only: [:index]
  end

  root to: 'static_files#index'
  get '*path', to: 'static_files#index'
end
