class StaticFilesController < ActionController::Base
  def index
    render file: 'public/angular/index.html'
  end
end