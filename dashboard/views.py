from django.http import HttpResponse,JsonResponse, HttpResponseNotFound
from django.template import RequestContext, loader
import os

def index(request):
    template = loader.get_template('dashboard/index.html')
    base_dir = os.path.dirname(os.path.dirname(__file__))
    PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
    static_path = os.path.join(base_dir, 'static')
    context = RequestContext(request, {"base_dir": base_dir
                                      ,"project_dir": PROJECT_PATH
                                      ,"static_dir": static_path})
    return HttpResponse(template.render(context))