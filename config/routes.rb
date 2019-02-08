Rails.application.routes.draw do
  root to: 'static_files#index'
  get '*path', to: 'static_files#index'
end
