Rails.application.routes.draw do
  namespace :api do
    post 'user_token' => 'user_token#create'
    resources :users, only: [:create, :show]
  end

  root to: 'static_files#index'
  get '*path', to: 'static_files#index'
end
